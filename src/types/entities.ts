import { BigNumber } from "ethers";
import { Address } from ".";

export type VaultTransaction = {
  id: Address;
  type: string;
  vaultAddress: Address;
  depositerAddress: Address;
  amount: string;
  timestamp: string;
};

export type FormattedVaultTransaction = Pick<
  VaultTransaction,
  "id" | "vaultAddress" | "depositerAddress" | "type"
> & {
  amount: BigNumber;
  timestamp: number;
};
