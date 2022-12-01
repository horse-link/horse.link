import utils from ".";
import {
  BetFilterOptions,
  BetHistory,
  BetStatus,
  SignedBetDataResponse
} from "../types/bets";
import { Bet } from "../types/entities";

export const calculateMaxPages = (betsArrayLength: number, totalBets: number) =>
  Math.ceil(totalBets / betsArrayLength);

export const incrementPage = (page: number, maxPages: number) =>
  page + 1 > maxPages || page + 1 < 1 ? maxPages : page + 1;

export const decrementPage = (page: number, maxPages: number) =>
  page - 1 < 1 || page - 1 > maxPages ? maxPages : page - 1;

export const getBetStatus = (
  bet: Bet,
  signedBetData: SignedBetDataResponse
): BetStatus => {
  const hasResult =
    signedBetData.winningPropositionId || signedBetData.marketResultAdded;
  if (+bet.payoutAt > Math.floor(Date.now() / 1000)) return "PENDING";
  if (!hasResult && !bet.settled) return "PENDING";
  if (hasResult && !bet.settled) return "RESULTED";
  if (hasResult && bet.settled) return "SETTLED";
  throw new Error("Invalid bet status");
};

export const getBetHistory = (
  bet: Bet,
  signedBetData: SignedBetDataResponse
): BetHistory => ({
  index: utils.formatting.formatBetId(bet.id),
  marketId: bet.marketId.toLowerCase(),
  marketAddress: bet.marketAddress.toLowerCase(),
  assetAddress: bet.assetAddress.toLowerCase(),
  propositionId: bet.propositionId.toLowerCase(),
  winningPropositionId: signedBetData.winningPropositionId,
  marketResultAdded: signedBetData.marketResultAdded,
  settled: bet.settled,
  punter: bet.owner.toLowerCase(),
  payoutDate: +bet.payoutAt,
  amount: bet.amount,
  payout: bet.payout,
  tx: bet.createdAtTx.toLowerCase(),
  blockNumber: +bet.createdAt,
  settledAt: bet.settled ? +bet.settledAt : undefined,
  marketOracleResultSig: signedBetData.marketOracleResultSig,
  status: getBetStatus(bet, signedBetData)
});

export const filterBetsByFilterOptions = (
  bets: BetHistory[],
  filter: BetFilterOptions
) => {
  if (filter === "ALL_BETS") return bets;
  return bets.filter(bet => bet.status === filter);
};
