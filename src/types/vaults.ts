import { BigNumber } from "ethers";
import { VaultInfo } from "./config";
import { Hash } from "@wagmi/core";
import { Address } from "wagmi";

export type Vault = {
  name: string;
  symbol: string;
  totalAssets: string;
  address: string;
};

export type VaultUserData = {
  percentage: string;
  userShareBalance: BigNumber;
  userAssetBalance: BigNumber;
};

export enum VaultTransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  BORROW = "borrow",
  REPAY = "repay"
}

export type VaultModalState = {
  type: VaultTransactionType;
  vault: VaultInfo;
};

export type VaultTransaction = {
  id: Hash;
  type: VaultTransactionType;
  vaultAddress: Address;
  userAddress: Address;
  amount: BigNumber;
  timestamp: number;
};

export type VaultHistory = {
  type: VaultTransactionType;
  amount: BigNumber;
  createdAt: number;
  vaultAddress: string;
  tx: string;
}[];
