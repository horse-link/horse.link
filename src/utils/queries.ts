import { ethers } from "ethers";

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
    assetAddress
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
  aggregator(id: "aggregator") {
    id
    totalBets
    totalMarkets
    totalVaults
  }
}`;

export const getProtocolStatsQuery = () => `
query GetProtocols{
  protocol(id: "protocol") {
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

export const getUserStatsQuery = (address?: string) => `{
  user(id: "${
    address ? address.toLowerCase() : ethers.constants.AddressZero
  }") {
    id
    totalDeposited
    inPlay
    pnl
    lastUpdate
  }
}`;
