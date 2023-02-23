import { useMemo } from "react";
import { useConfig } from "../../providers/Config";
import { Bet } from "../../types/subgraph";
import utils from "../../utils";
import useSubgraph from "../useSubgraph";
import { BigNumber, ethers } from "ethers";
import { LeaderboardStat } from "../../types/leaderboard";

type Response = {
  bets: Array<Bet>;
};

export const useLeaderboardStatistics = ():
  | Array<LeaderboardStat>
  | undefined => {
  const config = useConfig();
  const hlToken = config?.tokens.find(t => t.symbol.toLowerCase() === "hl");

  // get bets that were made with horse link token and have been settled
  // TODO: add date range
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getBetsQueryWithoutPagination({
      assetAddress: hlToken?.address.toLowerCase(),
      settled: true
    })
  );

  // reduce by user
  const sortedData = useMemo(() => {
    if (loading || !data?.bets.length || !hlToken || !config) return;
    const { bets } = data;

    // ETH address
    // winnings - sum of all payouts MINUS the initial faucet amount which is 1000 tokens (i think)

    const reduced = bets.reduce((prevObject, bet) => {
      const prevValue = prevObject[bet.owner] || ethers.constants.Zero;

      return {
        ...prevObject,
        [bet.owner]: ethers.utils
          .parseEther(bet.payout)
          .mul(bet.didWin ? "1" : "-1")
          .add(prevValue)
      };
    }, {} as Record<string, BigNumber>);

    // into array
    const asArray = Object.entries(reduced).reduce(
      (prevArray, [address, value]) => [...prevArray, { address, value }],
      [] as Array<{ address: string; value: BigNumber }>
    );

    // sort array
    asArray.sort((a, b) => +ethers.utils.formatEther(b.value.sub(a.value)));

    return asArray;
  }, [data, loading, hlToken, config]);

  return sortedData;
};
