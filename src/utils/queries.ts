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

const getOptionalFilterOptions = (filter?: BetFilterOptions) => {
  switch (filter) {
    case "ALL_BETS":
      return "";
    case "PENDING":
      // TODO: filter here instead of after formatBetHistory when subgraph is updated with market oracle as data source
      return "";
    case "RESULTED":
      return `settled: false`;
    case "SETTLED":
      return `settled: true`;
    default:
      throw new Error("Invalid filter option");
  }
};

export const getBetsQuery = (
  filter?: SubgraphFilter,
  statusFilter?: BetFilterOptions,
  skipMultiplier = 0
) => `query GetBets{
  bets(
    first: ${constants.subgraph.MAX_BET_ENTITIES}
    skip: ${constants.subgraph.MAX_BET_ENTITIES * skipMultiplier}
    where:{
      ${getFiltersFromObject(filter)}
      ${getOptionalFilterOptions(statusFilter)}
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
