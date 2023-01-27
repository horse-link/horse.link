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
import useRefetch from "../useRefetch";

type BetResponse = {
  bets: Bet[];
};
type AggregatorResponse = {
  aggregator: Aggregator;
};

export const useSubgraphBets = (
  myBetsEnabled: boolean,
  betFilterOptions: BetFilterOptions,
  marketId?: string
) => {
  const { address } = useAccount();
  const { shouldRefetch, refetch } = useRefetch();

  const [skipMultiplier, setSkipMultiplier] = useState(0);
  const [betData, setBetData] = useState<BetHistory[]>();

  // get aggregator data
  const { data: aggregatorData } = useSubgraph<AggregatorResponse>(
    utils.queries.getAggregatorQuery()
  );

  const incrementPage = useCallback(() => {
    if (!aggregatorData || myBetsEnabled) return;

    const totalBets = +aggregatorData.aggregator.totalBets;
    const nextMulti = skipMultiplier + 1;

    if (
      totalBets % (nextMulti * constants.subgraph.MAX_BET_ENTITIES) ===
      totalBets
    )
      return;

    setSkipMultiplier(nextMulti);
  }, [aggregatorData, skipMultiplier, setSkipMultiplier, myBetsEnabled]);

  const decrementPage = useCallback(() => {
    if (!aggregatorData || myBetsEnabled) return;

    const previousMulti = skipMultiplier - 1;
    if (skipMultiplier === 0) return;

    setSkipMultiplier(previousMulti);
  }, [aggregatorData, skipMultiplier, setSkipMultiplier, myBetsEnabled]);

  // reset page when my bets get toggled
  useEffect(() => {
    setSkipMultiplier(0);
    setBetData(undefined);
  }, [myBetsEnabled]);

  // get bet data
  useEffect(() => {
    // https://www.developerway.com/posts/fetching-in-react-lost-promises
    let isActive = true;

    if (!aggregatorData) return;
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

    ApolloClient.query<BetResponse>({
      query
    }).then(({ data: { bets } }) => {
      Promise.all(
        bets.map(async bet => {
          const signedData = await api.getWinningResultSignature(
            utils.formatting.parseBytes16String(bet.marketId)
          );

          return utils.bets.getBetHistory(bet, signedData);
        })
      ).then(betsWithApiData => {
        const filteredBets = utils.bets.filterBetsByFilterOptions(
          betsWithApiData,
          betFilterOptions
        );

        if (isActive) setBetData(filteredBets);
      });
    });

    return () => {
      isActive = false;
    };
  }, [
    myBetsEnabled,
    betFilterOptions,
    marketId,
    aggregatorData,
    address,
    skipMultiplier,
    shouldRefetch
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
    currentPage: skipMultiplier + 1,
    refetch,
    incrementPage,
    decrementPage
  };
};
