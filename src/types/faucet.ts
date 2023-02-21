import { BigNumber } from "ethers";

export type FaucetBalance = {
  name: string;
  symbol: string;
  amount: BigNumber;
  decimals: number;
};
