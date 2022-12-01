import { BigNumber } from "ethers";

export type UserBalance = {
  value: BigNumber;
  decimals: number;
  formatted: string;
};
