import { useEffect, useState } from "react";
import api from "../../apis/Api";
import { BetHistory } from "../../types";
import { Bet } from "../../types/entities";
import useSubgraph from "../useSubgraph";

type Response = {
  bets: Bet[];
};

const useBetHistory = (address?: string) => {
  const [betHistory, setBetHistory] = useState<BetHistory[]>();

  const query = `{
    bets(
      first: 1000
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
        const signedData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return {
          index: +bet.id,
          marketId: bet.marketId.toLowerCase(),
          propositionId: bet.propositionId.toLowerCase(),
          winningPropositionId: signedData.winningPropositionId,
          marketResultAdded: signedData.marketResultAdded,
          settled: bet.settled,
          punter: bet.owner.toLowerCase(),
          amount: bet.amount,
          tx: bet.createdAtTx.toLowerCase(),
          blockNumber: +bet.createdAt,
          marketOracleResultSig: signedData.marketOracleResultSig
        };
      })
    ).then(setBetHistory);
  }, [data, loading]);

  return betHistory;
};

export default useBetHistory;
