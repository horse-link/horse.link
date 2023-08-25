import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";
import utils from "../../utils";
import { useApi } from "../../providers/Api";
import { usePromise } from "../usePromise";
import { BetResult } from "../../types/subgraph";

export const useMarketStatistics = () => {
  const api = useApi();
  // const betsData = usePromise(api.getMarketStatsOld);
  const statsData = usePromise(api.getMarketStats);

  const totalBets = useMemo(() => {
    if (!statsData) return ethers.constants.Zero;

    return statsData.totalBets;
  }, []);

  const totalVolume = useMemo(() => {
    if (!statsData) return ethers.constants.Zero;

    const totalVolume = BigNumber.from(statsData.totalVolume);
    return totalVolume;
  }, []);

  const largestBet = useMemo(() => {
    if (!statsData) return ethers.constants.Zero;

    const largestBet = BigNumber.from(statsData.largestBet);
    return largestBet;
  }, []);

  // const profitablity = useMemo(() => {
  //   if (!betsData) return;

  //   const winningBets = betsData.filter(bet => bet.result === BetResult.WINNER);

  //   return betsData.length;
  // }, [betsData]);

  return {
    totalBets,
    totalVolume,
    largestBet
  };
};
