import { VaultInfo } from "./config";

export type Vault = {
  name: string;
  symbol: string;
  totalAssets: string;
  address: string;
};

export type VaultUserData = {
  vaultBalance: string;
  userBalance: string;
  performance: string;
  asset: string;
};

export enum VaultTransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

export type VaultModalState = {
  type: VaultTransactionType;
  vault: VaultInfo;
};
