import { ethers } from "ethers";
import { BetHistory, SignedBetDataResponse } from "../types";
import { Bet } from "../types/entities";

export const formatToFourDecimals = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  if (parsedAmount < 0.0001) return "<0.0001";

  const roundedToFourDecimal = parsedAmount.toFixed(4);
  const removedTrailingZeros = (+roundedToFourDecimal).toString();
  return removedTrailingZeros;
};

export const formatToTwoDecimals = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  const roundedToTwoDecimals = parsedAmount.toFixed(2);
  return roundedToTwoDecimals;
};

export const formatBetHistory = (
  bet: Bet,
  signedBetData: SignedBetDataResponse
): BetHistory => ({
  index: +bet.id,
  marketId: ethers.utils.parseBytes32String(bet.marketId),
  propositionId: ethers.utils.parseBytes32String(bet.propositionId),
  winningPropositionId: signedBetData.winningPropositionId,
  marketResultAdded: signedBetData.marketResultAdded,
  settled: bet.settled,
  punter: bet.owner.toLowerCase(),
  amount: bet.amount,
  tx: bet.createdAtTx.toLowerCase(),
  blockNumber: +bet.createdAt,
  marketOracleResultSig: signedBetData.marketOracleResultSig
});
