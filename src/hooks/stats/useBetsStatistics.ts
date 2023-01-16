import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";
import { Bet } from "../../types/entities";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";

type Response = {
  bets: Bet[];
};

const MILLISECONDS_TO_SECONDS_DIVISOR = 1000;
const SECONDS_TWENTYFOUR_HOURS = 86400;

export const useBetsStatistics = (didWin?: boolean) => {
  const yesterdayFilter = useMemo(
    () =>
      Math.floor(
        Date.now() / MILLISECONDS_TO_SECONDS_DIVISOR - SECONDS_TWENTYFOUR_HOURS
      ),
    []
  );
  // This is the last 24 hours of data
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getMarketStatsQuery(yesterdayFilter, didWin)
  );

  const betsData = useMemo(() => {
    if (loading || !data) return;

    return data.bets;
  }, [data, loading]);

  //Total winning bets for the bets page
  const totalWinningBets = useMemo(() => {
    if (!betsData) return;

    return betsData.length;
  }, [betsData]);

  //Winning volume bets on the bets page
  const totalWinningVolume = useMemo(() => {
    if (!betsData) return;
    if (!totalWinningBets) return ethers.constants.Zero;

    const amountBigNumbers = betsData.map(bet => BigNumber.from(bet.payout));

    return amountBigNumbers.reduce(
      (sum, value) => sum.add(value),
      ethers.constants.Zero
    );
  }, [betsData, totalWinningBets]);

  //Largest winning bet on the bets page
  const largestWinningBet = useMemo(() => {
    if (!betsData) return;
    if (!totalWinningBets) return utils.mocks.getMockBet();

    return betsData.reduce((prev, curr) =>
      BigNumber.from(curr.payout).gt(BigNumber.from(prev.payout)) ? curr : prev
    );
  }, [betsData, totalWinningBets]);

  return {
    totalWinningBets,
    totalWinningVolume,
    largestWinningBet
  };
};
