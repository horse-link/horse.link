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

// add a comma every 3 digits
export const formatNumberWithCommas = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  const formatToFourDecimal = parsedAmount.toFixed(6);
  const roundedToFourDecimal = +formatToFourDecimal;
  const convertToFourDecimalsWithCommas = roundedToFourDecimal.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 4,
      minimumFractionDigits: 4
    }
  );
  return convertToFourDecimalsWithCommas;
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
