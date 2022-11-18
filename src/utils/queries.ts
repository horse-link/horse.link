export const getBetsQuery = (
  limit: number,
  skip: number,
  address?: string
) => `{
  bets(
    skip: ${skip}
    first: ${limit}
    ${address ? `where: { owner: "${address.toLowerCase()}" }` : ""}
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
