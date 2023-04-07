import { BigNumber } from "ethers";
import { ERC20, Market } from "../typechain";
import { EcSignature } from "./general";

import { BackParams } from "./meets";

export type ScratchedRunner = {
  b16propositionId: string;
  odds: number;
  totalOdds: string;
  marketResultAdded: boolean;
  signature?: EcSignature;
};

export type SignedBetDataResponse = {
  marketResultAdded: boolean;
  winningPropositionId?: string;
  marketOracleResultSig?: EcSignature;
  scratchedRunners?: ScratchedRunner[];
};

export type BetTablePaginationValues = 25 | 50 | 100;

export type BetStatus =
  | "RESULTED"
  | "PENDING"
  | "SCRATCHED"
  | "SETTLED"
  | "INVALID";

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
  settledAtTx?: string;
  winningPropositionId?: string;
  marketOracleResultSig?: EcSignature;
  scratched?: ScratchedRunner;
  status: BetStatus;
};

export type TotalBetsOnPropositions = Record<
  string,
  {
    amount: string;
    percentage: number;
  }
>;

export type BetTotals = Record<
  string,
  {
    symbol: string;
    payout: BigNumber;
    stake: BigNumber;
  }
>;

// All info needed to process a multibet
export type MarketMultiBetInfo = {
  tokenContract: ERC20;
  marketContract: Market;
  assetAddress: string;
  allowance: BigNumber;
  totalWagers: BigNumber;
  backs: BackParams[];
};
