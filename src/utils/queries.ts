const optionalAddressFilter = (address?: string) =>
  address ? `where: { owner: "${address.toLowerCase()}" }` : "";

export const getBetsQuery = (
  limit: number,
  skip: number,
  address?: string
) => `{
  bets(
    skip: ${skip}
    first: ${limit}
    ${optionalAddressFilter(address)}
    orderBy: createdAt
    orderDirection: desc
  ) {
    id
    propositionId
    marketId
    marketAddress
    amount
    payout
    owner
    settled
    didWin
    createdAt
    settledAt
    createdAtTx
    settledAtTx
  }
}`;

export const getAggregatorQuery = () => `{
  aggregators {
    id
    totalBets
    totalMarkets
    totalVaults
  }
}`;

export const getProtocolStatsQuery = () => `{
  protocols {
    id
    inPlay
    initialTvl
    currentTvl
    performance
    lastUpdate
  }
}`;

export const getVaultHistoryQuery = (vaultAddress?: string) => `{
  vaultTransactions(
    first: 1000
    ${optionalAddressFilter(vaultAddress)}
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    type
    vaultAddress
    userAddress
    amount
    timestamp
  }
}`;

export const getMarketStatsQuery = (timestamp: number) => `{
  bets(
    first: 1000
    orderBy: amount
    orderDirection: desc
    where: {
      createdAt_gte: ${timestamp}
    }
  ) {
    id
    propositionId
    marketId
    marketAddress
    amount
    payout
    owner
    settled
    didWin
    createdAt
    settledAt
    createdAtTx
    settledAtTx
  }
}`;
