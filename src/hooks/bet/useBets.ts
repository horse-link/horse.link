import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import api from "../../apis/Api";
import { BetHistory } from "../../types";
import { Bet } from "../../types/entities";
import { formatBetHistory } from "../../utils/formatting";
import useSubgraph from "../useSubgraph";

type Response = {
  bets: Bet[];
};

const useBets = (limit = 1000, skip = 0) => {
  const { address } = useAccount();
  const [totalBetHistory, setTotalBetHistory] = useState<BetHistory[]>();
  const [userBetHistory, setUserBetHistory] = useState<BetHistory[]>();

  // get every (up to 1000) bet entities
  const query = `{
    bets(
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      propositionId
      marketId
      marketAddress
      amount
      payout
      owner
      settled
      createdAt
      settledAt
      createdAtTx
      settledAtTx
    }
  }`;

  const { data, loading } = useSubgraph<Response>(query);

  // set total bet history state
  useEffect(() => {
    if (loading || !data) return;

    // array starts from skip and ends at the limit from the skip
    const limitedArray = data.bets.filter(
      (_, i) => i >= skip && i < skip + limit
    );

    // only fetch api data for limited array for efficiency
    Promise.all(
      limitedArray.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return formatBetHistory(bet, signedBetData);
      })
    ).then(setTotalBetHistory);
  }, [data, loading, skip, limit]);

  // set user bet history
  useEffect(() => {
    if (loading || !data || !address) return;

    // get all the user bets
    const userBetsArray = data.bets.filter(
      bet => bet.owner.toLowerCase() === address.toLowerCase()
    );

    // filter by skip and liomit
    const limitedArray = userBetsArray.filter(
      (_, i) => i >= skip && i < skip + limit
    );

    // fetch api info for user bets array
    Promise.all(
      limitedArray.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return formatBetHistory(bet, signedBetData);
      })
    ).then(setUserBetHistory);
  }, [loading, data, address, skip, limit]);

  // calculate total bet count
  const totalBets = useMemo(() => {
    if (loading || !data) return;

    return data.bets.length;
  }, [data, loading]);

  // force loading components to render while new data is fetched
  useEffect(() => {
    setTotalBetHistory(undefined);
  }, [skip, limit]);

  return {
    totalBetHistory,
    userBetHistory,
    totalBets
  };
};

export default useBets;
