import { ethers } from "ethers";
import { FilterOptions } from "src/types";

const optionalAddressFilter = (address?: string) =>
  address ? `owner: "${address.toLowerCase()}"` : "";

const optionalFilterOptions = (filter?: FilterOptions) => {
  switch (filter) {
    case "ALL_BETS":
      return "";
    case "PENDING":
      // TODO: filter here instead of after formatBetHistory when subgraph is updated
      return "";
    case "RESULTED":
      return `settled: false`;
    case "SETTLED":
      return `settled: true`;
    default:
      throw new Error("Invalid filter option");
  }
};

export const getBetsQuery = ({
  limit,
  skip,
  address,
  filter
}: {
  limit: number;
  skip: number;
  address?: string;
  filter?: FilterOptions;
}) => `query GetBets{
  bets(
    skip: ${skip}
    first: ${limit}
    where:{
      ${optionalAddressFilter(address)}
      ${optionalFilterOptions(filter)}
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
    where:{
      ${optionalAddressFilter(vaultAddress)}
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
