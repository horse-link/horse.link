export type FormattedProtocol = {
  id: "protocol";
  inPlay: number;
  tvl: number;
  performance: number;
  lastUpdate: number;
};

// move to SDK (duplicate)
export type MarketStats = {
  totalBets: number;
  totalVolume: number;
  largestBet: number;
  profit: number;
};
