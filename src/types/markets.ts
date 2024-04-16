import { Address, Hash } from "@wagmi/core";
import { BigNumber } from "ethers";
import { MarketHistoryType } from "horselink-sdk";

export type MarketHistory = {
  id: Hash; // tx id
  vaultAddress: Address;
  amount: BigNumber;
  type: MarketHistoryType;
  createdAt: number;
};
