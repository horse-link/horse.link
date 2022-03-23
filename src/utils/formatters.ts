const fiatFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol"
});

export const numberToFormattedAUD = (amount: number) =>
  fiatFormatter.format(amount);
