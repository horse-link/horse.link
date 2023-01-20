import { EcSignature } from "./general";

export type SignedBetDataResponse = {
  marketResultAdded: boolean;
  winningPropositionId: string | undefined;
  marketOracleResultSig: EcSignature | undefined;
};

export type BetTablePaginationValues = 25 | 50 | 100;

export type BetStatus = "RESULTED" | "PENDING" | "SETTLED";

export type BetFilterOptions = "ALL_BETS" | BetStatus;

export type BetHistoryResponse = {
  results: BetHistory[];
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
  payoutDate: number;
  tx: string;
  blockNumber: number;
  settledAt?: number;
  winningPropositionId?: string;
  marketOracleResultSig?: EcSignature;
  status: BetStatus;
};

export type TotalBetsOnPropositions = Record<
  string,
  {
    amount: string;
    percentage: number;
  }
>;
