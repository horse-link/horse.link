import { BigNumber } from "ethers";

export type LeaderboardStat = {
  address: string;
  value: BigNumber;
};

export type LeaderboardBalance = {
  address: string;
  value: BigNumber;
  decimals: number;
  formatted: string;
};
