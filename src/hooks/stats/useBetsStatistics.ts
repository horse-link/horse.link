import { BigNumber, ethers } from "ethers";
import { useMemo, useRef } from "react";
import { Bet, BetResult } from "../../types/subgraph";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import constants from "../../constants";

type Response = {
  bets: Array<Bet>;
};

export const useBetsStatistics = () => {
  const { current: now } = useRef(
    Math.floor(Date.now() / constants.time.ONE_SECOND_MS)
  );
  const { current: yesterdayFilter } = useRef(
    now - constants.time.TWENTY_FOUR_HOURS_S
  );

  const { data, loading } = useSubgraph<Response>(
    utils.queries.getBetsQueryWithoutPagination(now, {
      settledAt_gte: yesterdayFilter,
      result: BetResult.WINNER
    })
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
