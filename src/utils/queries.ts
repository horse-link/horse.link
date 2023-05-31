import { BetFilterOptions } from "../types/bets";
import { SubgraphFilter } from "../types/subgraph";
import constants from "../constants";

const getFiltersFromObject = (filter?: SubgraphFilter) => {
  if (!filter) return "";

  return Object.entries(filter)
    .map(([key, value]) => {
      // if value is undefined
      if (typeof value === "undefined") return "";
      // if value is boolean or number
      if (typeof value === "boolean" || typeof value === "number")
        return `${key}: ${value}`;

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
    asset
    payoutAt
    market
    marketId
    propositionId
    amount
    payout
    owner
    createdAt
    createdAtTx
    settled
    result
    recipient
    settledAt
    settledAtTx
    refunded
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
    asset
    payoutAt
    market
    marketId
    propositionId
    amount
    payout
    owner
    createdAt
    settled
    result
    recipient
    settledAt
    settledAtTx
    refunded
  }
}`;

export const getDepositsWithoutPagination = (
  filter?: SubgraphFilter
) => `query getDeposits{
  vaultTransactions(
    first: 1000
    where: {
      ${getFiltersFromObject(filter)}
      type: "deposit"
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

export const getWithdrawsWithoutPagination = (
  filter?: SubgraphFilter
) => `query getWithdraws{
  vaultTransactions(
    first: 1000
    where: {
      ${getFiltersFromObject(filter)}
      type: "withdraw"
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

export const getVaultHistory = () => `query getVaultHistory{
  withdraws: vaultTransactions(
    where: {
      type: "withdraw"
    }
  ) {
    id
    type
    vaultAddress
    userAddress
    amount
    timestamp
  }
  deposits: vaultTransactions(
    where: {
      type: "deposit"
    }
  ) {
    id
    type
    vaultAddress
    userAddress
    amount
    timestamp
  }
}
`;
