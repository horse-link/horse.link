import { BigNumber } from "ethers";
import { Address } from "wagmi";

enum VaultTransactionType {
  withdraw = "withdraw",
  deposit = "deposit"
}

export type VaultTransaction = {
  id: Address;
  type: VaultTransactionType;
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

export type Protocol = {
  // protocol id will always be protocol
  id: "protocol";
  inPlay: string;
  tvl: string;
  performance: string;
};

export type FormattedProtocol = Pick<Protocol, "id"> & {
  inPlay: BigNumber;
  tvl: BigNumber;
  performance: number;
};
