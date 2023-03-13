import { useEffect, useMemo, useRef, useState } from "react";
import { useBetSlipContext } from "../../providers/BetSlip";
import {
  BetFilterOptions,
  BetHistory,
  TotalBetsOnPropositions
} from "../../types/bets";
import { Bet } from "../../types/subgraph";
import useRefetch from "../useRefetch";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import constants from "../../constants";
import { gql } from "@apollo/client";
import { ApolloClient } from "../../providers/Apollo";
import api from "../../apis/Api";
import { ethers } from "ethers";

type BetResponse = {
  bets: Bet[];
};

export const useSubgraphBets = (
  filter: BetFilterOptions,
  marketId?: string,
  owner?: string
) => {
  const { shouldRefetch, refetch } = useRefetch();
  const { current: now } = useRef(Math.floor(Date.now() / 1000));

  // refetch when successful transactions are made
  const { hashes } = useBetSlipContext();
  useEffect(() => {
    if (!hashes?.length) return;
    refetch();
  }, [hashes]);

  const [bets, setBets] = useState<Array<BetHistory>>();
  const [skipMultiplier, setSkipMultiplier] = useState(0);
  const userBetsToggled = !!owner;

  // subgraph query
  const { data: rawBets } = useSubgraph<BetResponse>(
    utils.queries.getBetsQueryWithoutPagination(
      now,
      {
        owner: owner?.toLowerCase()
      },
      filter
    )
  );

  // total
  const totalBets = rawBets?.bets.length;

  // increment skip
  const incrementPage = () => {
    if (!totalBets) return;

    const nextMulti = skipMultiplier + 1;

    if (
      totalBets % (nextMulti * constants.subgraph.MAX_BET_ENTITIES) ===
      totalBets
    )
      return;

    setSkipMultiplier(nextMulti);
  };

  // decrement skip
  const decrementPage = () => {
    if (!totalBets) return;

    const previousMulti = skipMultiplier - 1;
    if (skipMultiplier === 0) return;

    setSkipMultiplier(previousMulti);
  };

  // reset page when user's bets toggled
  useEffect(() => {
    setSkipMultiplier(0);
    setBets(undefined);
  }, [userBetsToggled]);

  // get bets
  useEffect(() => {
    // https://www.developerway.com/posts/fetching-in-react-lost-promises
    let isActive = true;

    if (!rawBets) return;
    setBets(undefined);

    const query = utils.queries.getBetsQuery(
      now,
      {
        owner: owner?.toLowerCase(),
        marketId
      },
      filter,
      skipMultiplier
    );

    // query subgraph
    ApolloClient.query<BetResponse>({
      query: gql(query),
      fetchPolicy: "network-only"
    }).then(async ({ data: { bets } }) => {
      const marketIds = bets.map(bet => bet.marketId);
      const uniqueMarketIds = [...new Set(marketIds)];
      const signedDataMap = new Map();
      await Promise.all(
        uniqueMarketIds.map(async marketId => {
          const signedData = await api.getWinningResultSignature(
            utils.formatting.parseBytes16String(marketId)
          );
          signedDataMap.set(marketId, signedData);
        })
      );
      const signedBets = await Promise.all(
        bets.map(async bet => {
          const signedData = signedDataMap.get(bet.marketId);
          return utils.bets.getBetHistory(bet, signedData);
        })
      );

      if (isActive) setBets(signedBets);
    });

    // cleanup
    return () => {
      isActive = false;
    };
  }, [rawBets, skipMultiplier, filter, marketId, owner, shouldRefetch, now]);

  // total proposition bets
  const totalBetsOnPropositions = useMemo(() => {
    if (!bets) return;

    const totalBets = bets.reduce((prevObject, bet, _, array) => {
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
  }, [bets]);

  return {
    betData: bets,
    totalBetsOnPropositions,
    currentPage: skipMultiplier + 1,
    refetch,
    incrementPage,
    decrementPage,
    setSkipMultiplier
  };
};
