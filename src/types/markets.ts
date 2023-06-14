import { Address, Hash } from "@wagmi/core";
import { BigNumber } from "ethers";

export type Market = {
  address: string;
  vaultAddress: string;
  name: string;
  target: number;
  totalInPlay: string;
};

export type MarketHistoryType = "BORROW" | "REPAY";

export type MarketHistory = {
  id: Hash; // tx id
  vaultAddress: Address;
  amount: BigNumber;
  type: MarketHistoryType;
  createdAt: number;
};
