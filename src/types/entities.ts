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
  initialTvl: string;
  currentTvl: string;
  lastUpdate: string;
};

export type FormattedProtocol = Pick<Protocol, "id"> & {
  inPlay: BigNumber;
  tvl: BigNumber;
  performance: number;
  lastUpdate: number;
};

export type Bet = {
  id: string;
  propositionId: string;
  marketId: string;
  marketAddress: string;
  amount: string;
  payout: string;
  owner: Address;
  settled: boolean;
  createdAt: string;
  settledAt: string;
  createdAtTx: string;
  settledAtTx: string;
};

export type FormattedBet = Pick<
  Bet,
  | "propositionId"
  | "marketId"
  | "marketAddress"
  | "settled"
  | "createdAtTx"
  | "settledAtTx"
> & {
  index: number;
  amount: BigNumber;
  payout: BigNumber;
  punter: string;
  createdAt: number;
  settledAt: number;
};
