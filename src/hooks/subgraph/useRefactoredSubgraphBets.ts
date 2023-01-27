import { useAccount } from "wagmi";
import {
  BetFilterOptions,
  BetHistory,
  TotalBetsOnPropositions
} from "../../types/bets";
import { Aggregator, Bet } from "../../types/subgraph";
import utils from "../../utils";
import useSubgraph from "../useSubgraph";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApolloClient } from "../../providers/Apollo";
import { gql } from "@apollo/client";
import api from "../../apis/Api";
import { ethers } from "ethers";
import constants from "../../constants";

type BetResponse = {
  bets: Bet[];
};
type AggregatorResponse = {
  aggregator: Aggregator;
};

export const useRefactoredSubgraphBets = (
  myBetsEnabled: boolean,
  betFilterOptions: BetFilterOptions,
  marketId?: string
) => {
  const { address } = useAccount();

  const [skipMultiplier, setSkipMultiplier] = useState(0);
  const [betData, setBetData] = useState<BetHistory[]>();

  // get aggregator data
  const { data: aggregatorData } = useSubgraph<AggregatorResponse>(
    utils.queries.getAggregatorQuery()
  );

  const incrementPage = useCallback(() => {
    if (!aggregatorData) return;

    const totalBets = +aggregatorData.aggregator.totalBets;
    const nextMulti = skipMultiplier + 1;
    if (nextMulti * constants.subgraph.MAX_BET_ENTITIES > totalBets)
      return setSkipMultiplier(skipMultiplier);

    setSkipMultiplier(nextMulti);
  }, [aggregatorData, skipMultiplier]);

  const decrementPage = useCallback(() => {
    if (!aggregatorData) return;

    const previousMulti = skipMultiplier - 1;
    if (previousMulti * constants.subgraph.MAX_BET_ENTITIES < 0)
      return setSkipMultiplier(skipMultiplier);

    setSkipMultiplier(previousMulti);
  }, [aggregatorData, skipMultiplier]);

  // get bet data
  useEffect(() => {
    if (!aggregatorData) return;

    // https://www.developerway.com/posts/fetching-in-react-lost-promises
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

      const {
        data: { bets }
      } = await ApolloClient.query<BetResponse>({
        query
      });

      const betsWithApiData = await Promise.all(
        bets.map(async bet => {
          const signedData = await api.getWinningResultSignature(
            utils.formatting.parseBytes16String(bet.marketId)
          );

          return utils.bets.getBetHistory(bet, signedData);
        })
      );

      const filteredBets = utils.bets.filterBetsByFilterOptions(
        betsWithApiData,
        betFilterOptions
      );

      if (isActive) setBetData(filteredBets);
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

  const totalBetsOnPropositions = useMemo(() => {
    if (!betData) return;

    const totalBets = betData.reduce((prevObject, bet, _, array) => {
      const proposition = utils.formatting.parseBytes16String(
        bet.propositionId
      );

      const amount = ethers.utils
        .parseEther(prevObject[proposition]?.amount || "0")
        .add(ethers.utils.parseEther(bet.amount));

      const totalBetValue = array.reduce(
        (sum, cur) => sum.add(ethers.utils.parseEther(cur.amount)),
        ethers.constants.Zero
      );

      const proportion = amount
        .mul(ethers.constants.WeiPerEther)
        .div(totalBetValue);

      return {
        ...prevObject,
        [proposition]: {
          amount: ethers.utils.formatEther(amount),
          percentage: +ethers.utils.formatEther(proportion) * 100
        }
      };
    }, {} as TotalBetsOnPropositions);

    return totalBets;
  }, [betData]);

  return {
    betData,
    totalBetsOnPropositions,
    incrementPage,
    decrementPage
  };
};
