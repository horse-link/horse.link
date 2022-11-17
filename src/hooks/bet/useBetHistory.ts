import { useEffect, useState } from "react";
import api from "../../apis/Api";
import { BetHistory } from "../../types";
import { Bet } from "../../types/entities";
import { formatBetHistory } from "../../utils/formatting";
import useSubgraph from "../useSubgraph";

type Response = {
  bets: Bet[];
};

const useBetHistory = (pagination: number, address?: string) => {
  const [betHistory, setBetHistory] = useState<BetHistory[]>();

  const query = `{
    bets(
      first: ${pagination}
      ${address ? `where: { owner: "${address.toLowerCase()}" }` : ""}
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

  useEffect(() => {
    if (loading || !data) return;

    Promise.all(
      data.bets.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return formatBetHistory(bet, signedBetData);
      })
    ).then(setBetHistory);
  }, [data, loading]);

  useEffect(() => {
    // clearing the state when pagination changes forces
    // the loading components to render while the new data is fetched
    setBetHistory(undefined);
  }, [pagination]);

  return betHistory;
};

export default useBetHistory;
