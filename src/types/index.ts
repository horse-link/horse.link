import { BigNumber } from "ethers";
import { VaultInfo } from "./config";

export type VaultUserData = {
  vaultBalance: string;
  userBalance: string;
  performance: string;
  asset: string;
};

export type Token = {
  address: string;
  symbol: string;
  decimals: string;
};

export type Vault = {
  name: string;
  symbol: string;
  totalAssets: string;
  address: string;
};

export type Market = {
  address: string;
  vaultAddress: string;
  name: string;
  target: number;
  totalInPlay: string;
};

export type Back = {
  nonce: string;
  market_id: string;
  close: number;
  end: number;
  odds: number;
  proposition_id: string;
  signature: EcSignature;
};

export type EcSignature = {
  v: number;
  r: string;
  s: string;
};

export type BetHistory = {
  index: number;
  marketId: string;
  marketAddress: string;
  assetAddress: string;
  propositionId: string;
  marketResultAdded: boolean;
  settled: boolean;
  punter: string;
  amount: string;
  payout: string;
  tx: string;
  blockNumber: number;
  settledAt?: number;
  winningPropositionId?: string;
  marketOracleResultSig?: EcSignature;
  status: BetStatus;
};

export type BetHistoryResponse = {
  results: BetHistory[];
};

export type SignedBetDataResponse = {
  marketResultAdded: boolean;
  winningPropositionId: string | undefined;
  marketOracleResultSig: EcSignature | undefined;
};

export type SignedResponse = {
  owner: string;
  signature: string;
  // hash: string;
};

export type SignedRunnersResponse = {
  data: Runner[];
} & SignedResponse;

export type SignedMeetingsResponse = {
  data: MeetResponse;
} & SignedResponse;

export type MeetResponse = {
  nonce: string;
  created: number;
  expires: number;
  meetings: Meet[];
};

export type Meet = {
  id: string;
  name: string;
  location: string;
  date: string;
  races: Race[];
};

export type Race = {
  number: number;
  name: string;
  start?: string;
  start_unix?: number;
  end?: string;
  end_unix?: number;
  close?: string;
  close_unix?: number;
  status: "Normal" | "Interim" | "Paying";
  results?: number[];
};

export type Runner = {
  number: number;
  name: string;
  nonce: string;
  market_id: string;
  close: number;
  end: number;
  odds: number;
  proposition_id: string;
  proposition_id_hash: string;
  barrier: number;
  signature: EcSignature;
};

export type Signature = {
  message: string;
  messageHash: string;
  signature: string;
};

export type BetStatus = "RESULTED" | "PENDING" | "SETTLED";

export type FilterOptions = "ALL_BETS" | BetStatus;

export type PaginationValues = 25 | 50 | 100;

export enum VaultTransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

export type VaultModalState = {
  type: VaultTransactionType;
  vault: VaultInfo;
};

export type UserBalance = {
  value: BigNumber;
  decimals: number;
  formatted: string;
};
