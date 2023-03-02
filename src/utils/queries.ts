import { ethers } from "ethers";
import { BetFilterOptions } from "../types/bets";
import { SubgraphFilter } from "../types/subgraph";
import constants from "../constants";

const getFiltersFromObject = (filter?: SubgraphFilter) => {
  if (!filter) return "";

  return Object.entries(filter)
    .map(([key, value]) => {
      // if value is undefined
      if (typeof value === "undefined") return "";
      // if value is boolean
      if (typeof value === "boolean") return `${key}: ${value}`;

      // type is string
      return `${key}: "${value}"`;
    })
    .join("\n");
};

const getOptionalFilterOptions = (now: number, filter?: BetFilterOptions) => {
  switch (filter) {
    case "ALL_BETS":
      return "";
    case "PENDING":
      return `
        payoutAt_gt: ${now}
        settled: false
      `;
    case "RESULTED":
      return `
        payoutAt_lt: ${now}
        settled: false
      `;
    case "SETTLED":
      return `settled: true`;
    default:
      throw new Error("Invalid filter option");
  }
};

export const getBetsQuery = (
  now: number,
  filter?: SubgraphFilter,
  statusFilter: BetFilterOptions = "ALL_BETS",
  skipMultiplier = 0
) => `query GetBets{
  bets(
    first: ${constants.subgraph.MAX_BET_ENTITIES}
    skip: ${constants.subgraph.MAX_BET_ENTITIES * skipMultiplier}
    where:{
      ${getFiltersFromObject(filter)}
      ${getOptionalFilterOptions(now, statusFilter)}
    }
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
    payoutAt
    owner
    settled
    didWin
    createdAt
    settledAt
    createdAtTx
    settledAtTx
  }
}`;

export const getBetsQueryWithoutPagination = (
  now: number,
  filter?: SubgraphFilter,
  statusFilter: BetFilterOptions = "ALL_BETS"
) => `query GetBetsWithoutPagination{
  bets(
    first: 1000
    where: {
      ${getFiltersFromObject(filter)}
      ${getOptionalFilterOptions(now, statusFilter)}
    }
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
    payoutAt
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

export const getVaultHistoryQuery = (filter?: SubgraphFilter) => `{
  vaultTransactions(
    first: 1000
    where:{
      ${getFiltersFromObject(filter)}
    }
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

export const getVaultStatsQuery = (filter?: SubgraphFilter) => `{
  vaultTransactions(
    first: 1000
    where:{
      ${getFiltersFromObject(filter)}
    }
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

export const getMarketStatsQuery = (filter?: SubgraphFilter) => `{
  bets(
    first: 1000
    orderBy: amount
    orderDirection: desc
    where: {
      ${getFiltersFromObject(filter)}
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
