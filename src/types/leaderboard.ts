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

export type LeaderboardUserBalance = Pick<LeaderboardBalance, "address"> & {
  balance: {
    value: BigNumber;
    decimals: number;
    formatted: string;
  };
  earnings: {
    value: BigNumber;
    decimals: number;
    formatted: string;
  };
  rank: number;
};
