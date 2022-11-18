import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import api from "../../apis/Api";
import { BetHistory } from "../../types";
import { Aggregator, Bet } from "../../types/entities";
import { formatBetHistory } from "../../utils/formatting";
import { getAggregatorQuery, getBetsQuery } from "../../utils/queries";
import useSubgraph from "../useSubgraph";

type Response = {
  bets: Bet[];
};

type AggregatorResponse = {
  aggregators: Aggregator[];
};

const useBets = (limit: number, skip: number) => {
  const { address } = useAccount();
  const [totalBetHistory, setTotalBetHistory] = useState<BetHistory[]>();
  const [userBetHistory, setUserBetHistory] = useState<BetHistory[]>();

  // total bets
  const { data: totalData, loading: totalDataLoading } = useSubgraph<Response>(
    getBetsQuery(limit, skip)
  );
  // user bets
  const { data: userData, loading: userDataLoading } = useSubgraph<Response>(
    getBetsQuery(limit, skip, address)
  );
  // total bets count
  const { data: countData, loading: countDataLoading } =
    useSubgraph<AggregatorResponse>(getAggregatorQuery());

  // set total bet history state
  useEffect(() => {
    if (totalDataLoading || !totalData) return;

    // array starts from skip and ends at the limit from the skip
    const filteredTotalData = totalData.bets.filter(
      (_, i) => i >= skip && i < skip + limit
    );

    // only fetch api data for limited array for efficiency
    Promise.all(
      filteredTotalData.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return formatBetHistory(bet, signedBetData);
      })
    ).then(setTotalBetHistory);
  }, [skip, limit, totalData, totalDataLoading]);

  // set user bet history state
  useEffect(() => {
    if (userDataLoading || !userData || !address) return;

    const filteredUserData = userData.bets.filter(
      (_, i) => i >= skip && i < skip + limit
    );

    Promise.all(
      filteredUserData.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return formatBetHistory(bet, signedBetData);
      })
    ).then(setUserBetHistory);
  }, [skip, limit, address, userData, userDataLoading]);

  // calculate total bet count
  const totalBets = useMemo(() => {
    if (countDataLoading || !countData) return 1;

    // id is constant so there will always be one element in array
    const aggregate = countData.aggregators[0];

    return +aggregate.totalBets;
  }, [countData, countDataLoading]);

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
