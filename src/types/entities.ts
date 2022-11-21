import { BigNumber } from "ethers";
import { Address } from "wagmi";

export type Aggregator = {
  // id will always be aggregator
  id: "aggregator";
  totalBets: string;
  totalMarkets: string;
  totalVaults: string;
  lastUpdate: string;
};

export type FormattedAggregator = Pick<Aggregator, "id"> & {
  totalBets: number;
  totalMarkets: number;
  totalVaults: number;
  lastUpdate: number;
};

export type Protocol = {
  // id will always be protocol
  id: "protocol";
  inPlay: string;
  initialTvl: string;
  currentTvl: string;
  performance: string;
  lastUpdate: string;
};

export type FormattedProtocol = Pick<Protocol, "id"> & {
  inPlay: BigNumber;
  tvl: BigNumber;
  performance: number;
  lastUpdate: number;
};

export type Registry = {
  // id will always be registry
  id: "registry";
  vaults: string[];
  markets: string[];
  lastUpdate: string;
};

export type FormattedRegistry = Pick<Registry, "id" | "vaults" | "markets"> & {
  lastUpdate: number;
};

export type Bet = {
  id: string;
  propositionId: string;
  marketId: string;
  marketAddress: Address;
  assetAddress: Address;
  amount: string;
  payout: string;
  owner: Address;
  settled: boolean;
  didWin: boolean;
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
  | "assetAddress"
  | "settled"
  | "didWin"
  | "createdAtTx"
  | "settledAtTx"
> & {
  index: number;
  amount: BigNumber;
  payout: BigNumber;
  punter: Address;
  createdAt: number;
  settledAt: number;
};

enum VaultTransactionType {
  withdraw = "withdraw",
  deposit = "deposit"
}

export type VaultTransaction = {
  id: Address;
  type: VaultTransactionType;
  vaultAddress: Address;
  userAddress: Address;
  amount: string;
  timestamp: string;
};

export type FormattedVaultTransaction = Pick<
  VaultTransaction,
  "id" | "vaultAddress" | "userAddress" | "type"
> & {
  amount: BigNumber;
  timestamp: number;
};

export type User = {
  id: Address;
  totalDesposited: string;
  inPlay: string;
  pnl: string;
  lastUpdate: string;
};

export type FormattedUser = Pick<User, "id"> & {
  totalDeposited: BigNumber;
  inPlay: BigNumber;
  pnl: BigNumber;
  lastUpdate: number;
};
