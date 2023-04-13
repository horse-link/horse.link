import { BigNumber } from "ethers";
import { useState } from "react";
// import { useAccount } from "wagmi";

export const useUserStatistics = () => {
  // const { address } = useAccount();
  const [userStats] = useState<{
    // setResult
    totalDeposited: BigNumber;
    inPlay: BigNumber;
    pnl: BigNumber;
    lastUpdate: number;
  }>();

  // TODO

  return userStats;
};
