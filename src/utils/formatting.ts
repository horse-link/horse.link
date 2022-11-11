export const formatToFourDecimals = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  if (parsedAmount < 0.0001) return "0.0001<";

  const roundedToFourDecimal = parsedAmount.toFixed(4);
  const removedTrailingZeros = (+roundedToFourDecimal).toString();
  return removedTrailingZeros;
};