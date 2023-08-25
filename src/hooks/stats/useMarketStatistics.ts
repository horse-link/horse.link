import { ethers } from "ethers";
import { useMemo } from "react";
import { useApi } from "../../providers/Api";
import { usePromise } from "../usePromise";

export const useMarketStatistics = () => {
  const api = useApi();
  const statsData = usePromise(api.getMarketStats);

  const totalBets = useMemo(() => {
    if (!statsData) return ethers.constants.Zero;

    return statsData.totalBets;
  }, [statsData]);

  const totalVolume = useMemo(() => {
    if (!statsData) return ethers.constants.Zero;

    const totalVolume = statsData.totalVolume;
    return totalVolume;
  }, [statsData]);

  const largestBet = useMemo(() => {
    if (!statsData) return ethers.constants.Zero;

    // const largestBet = BigNumber.from(statsData.largestBet);
    const largestBet = statsData.largestBet;
    return largestBet;
  }, [statsData]);

  // const profitability = useMemo(() => {
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
