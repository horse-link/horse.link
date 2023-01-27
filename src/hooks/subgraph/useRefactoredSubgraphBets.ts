import { useAccount } from "wagmi";
import { BetFilterOptions, BetHistory } from "../../types/bets";
import { Aggregator, Bet } from "../../types/subgraph";
import utils from "../../utils";
import useSubgraph from "../useSubgraph";
import { useCallback, useEffect, useState } from "react";
import { ApolloClient } from "../../providers/Apollo";
import { gql } from "@apollo/client";

type AggregatorResponse = {
  aggregator: Aggregator;
};

export const useRefactoredSubgraphBets = (
  myBetsEnabled: boolean,
  betFilterOptions: BetFilterOptions,
  marketId?: string
) => {
  const { address } = useAccount();
  const [skipMultiplier, setSkipMultiplier] = useState(1);
  const [betData, setBetData] = useState<BetHistory[]>();

  // get aggregator data
  const { data: aggregatorData } = useSubgraph<AggregatorResponse>(
    utils.queries.getAggregatorQuery()
  );

  const incrementPage = useCallback(() => {
    if (!aggregatorData) return;

    const totalBets = +aggregatorData.aggregator.totalBets;
    setSkipMultiplier(1);
  }, [aggregatorData, skipMultiplier]);

  const decrementPage = useCallback(() => {
    if (!aggregatorData) return;

    const totalBets = +aggregatorData.aggregator.totalBets;
    setSkipMultiplier(1);
  }, [aggregatorData, skipMultiplier]);

  // get bet data
  useEffect(() => {
    if (!aggregatorData) return;

    let isActive: boolean;
    (async () => {
      isActive = true;
      setBetData(undefined);

      const query = gql`
        ${utils.queries.getBetsQuery(
          {
            owner: myBetsEnabled && address ? address.toLowerCase() : undefined,
            marketId
          },
          betFilterOptions,
          skipMultiplier
        )}
      `;

      const bets = await ApolloClient.query<Bet[]>({
        query
      });
    })();

    return () => {
      isActive = false;
    };
  }, [
    myBetsEnabled,
    betFilterOptions,
    marketId,
    aggregatorData,
    address,
    skipMultiplier
  ]);
};
