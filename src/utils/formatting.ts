import { BetHistory, SignedBetDataResponse } from "../types";
import { Bet, BetId } from "../types/entities";

export const formatToFourDecimals = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  if (parsedAmount === 0) return "0";
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

export const formatBetId = (betId: BetId) => {
  const segments = betId.split("_");
  return +segments[2];
};

export const formatBetHistory = (
  bet: Bet,
  signedBetData: SignedBetDataResponse
): BetHistory => ({
  index: formatBetId(bet.id),
  marketId: bet.marketId.toLowerCase(),
  marketAddress: bet.marketAddress.toLowerCase(),
  assetAddress: bet.assetAddress.toLowerCase(),
  propositionId: bet.propositionId.toLowerCase(),
  winningPropositionId: signedBetData.winningPropositionId,
  marketResultAdded: signedBetData.marketResultAdded,
  settled: bet.settled,
  punter: bet.owner.toLowerCase(),
  amount: bet.amount,
  tx: bet.createdAtTx.toLowerCase(),
  blockNumber: +bet.createdAt,
  settledAt: bet.settled ? +bet.settledAt : undefined,
  marketOracleResultSig: signedBetData.marketOracleResultSig
});

export const shortenAddress = (address: string) =>
  `${address.slice(0, 5)}...${address.slice(address.length - 5)}`;

export const shortenHash = (hash: string) => {
  const start = hash.substring(0, 15);
  const end = hash.substring(hash.length - 15, hash.length);
  return `${start}...${end}`;
};
