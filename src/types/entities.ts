import { BigNumber } from "ethers";
import { Address } from "wagmi";

export type VaultTransaction = {
  id: Address;
  type: "withdraw" | "deposit";
  vaultAddress: Address;
  depositerAddress: Address;
  amount: string;
  timestamp: string;
};

export type FormattedVaultTransaction = Pick<
  VaultTransaction,
  "id" | "vaultAddress" | "depositerAddress"
> & {
  type: string;
  amount: BigNumber;
  timestamp: number;
};
