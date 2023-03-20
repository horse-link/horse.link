import { BigNumber } from "ethers";
import { VaultInfo } from "./config";

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
  WITHDRAW = "withdraw"
}

export type VaultModalState = {
  type: VaultTransactionType;
  vault: VaultInfo;
};
