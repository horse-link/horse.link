import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import api from "../../apis/Api";
import { Bet } from "../../types/entities";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import {
  BetFilterOptions,
  BetHistory,
  TotalBetsOnPropositions
} from "../../types/bets";
import { ethers } from "ethers";

type Response = {
  bets: Bet[];
};

const POLL_INTERVAL = 5000;

export const useSubgraphBets = (
  myBetsEnabled: boolean,
  filter: BetFilterOptions,
  marketId?: string
) => {
  const { address } = useAccount();
  const [betHistory, setBetHistory] = useState<BetHistory[]>();

  const { data, refetch } = useSubgraph<Response>(
    utils.queries.getBetsQuery({
      address: myBetsEnabled ? address : undefined,
      filter,
      marketId
    })
  );

  // refetch data on page load -- prevents stale data
  useEffect(() => {
    const refetchInterval = setInterval(refetch, POLL_INTERVAL);

    return () => clearInterval(refetchInterval);
  }, [marketId]);

  useEffect(() => {
    // local variable to prevent setting state after component unmounts
    // For more information see https://www.developerway.com/posts/fetching-in-react-lost-promises
    let isActive = true;
    const missingRequiredParam = myBetsEnabled && !address;
    if (!data || missingRequiredParam) return;
    setBetHistory(undefined);

    Promise.all(
      data.bets.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.getWinningResultSignature(
          utils.formatting.parseBytes16String(bet.marketId)
        );

        return utils.bets.getBetHistory(bet, signedBetData);
      })
    ).then(async bets => {
      const betsByFilterOptions = utils.bets.filterBetsByFilterOptions(
        bets,
        filter
      );
      isActive && setBetHistory(betsByFilterOptions);
    });

    return () => {
      // local variable from above
      isActive = false;
    };
  }, [data, address, filter, marketId]);

  const totalBetsOnPropositions = useMemo(() => {
    if (!betHistory) return;
    let totalSumAmount = 0;

    const sumMap = betHistory.reduce((acc, bet) => {
      const { propositionId, amount: bnAmount } = bet;
      const amount = +ethers.utils.formatEther(bnAmount);
      if (!acc[propositionId]) {
        acc[propositionId] = 0;
      }
      acc[propositionId] += amount;
      totalSumAmount += amount;
      return acc;
    }, {} as Record<string, number>);

    const sumWithPercentageMap = Object.keys(sumMap).reduce((acc, key) => {
      if (key === "total") return acc;
      const amount = sumMap[key];
      acc[key] = {
        amount,
        percentage: (amount / totalSumAmount) * 100
      };
      return acc;
    }, {} as TotalBetsOnPropositions);

    return sumWithPercentageMap;
  }, [betHistory]);

  return {
    betHistory,
    totalBetsOnPropositions,
    refetch
  };
};
