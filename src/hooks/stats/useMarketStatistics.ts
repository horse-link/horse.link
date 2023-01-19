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

export const useMarketStatistics = () => {
  const yesterdayFilter = useMemo(
    () =>
      Math.floor(
        Date.now() / MILLISECONDS_TO_SECONDS_DIVISOR - SECONDS_TWENTYFOUR_HOURS
      ),
    []
  );
  const filterObject = {
    createdAt_gte: yesterdayFilter
  };
  // This is the last 24 hours of data
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getMarketStatsQuery(filterObject)
  );

  const betsData = useMemo(() => {
    if (loading || !data) return;

    return data.bets;
  }, [data, loading]);

  //Total bets used on the market page
  const totalBets = useMemo(() => {
    if (!betsData) return;

    return betsData.length;
  }, [betsData]);

  //Total volume bets used on the market page
  const totalVolume = useMemo(() => {
    if (!betsData) return;
    if (!totalBets) return ethers.constants.Zero;

    const amountBigNumbers = betsData.map(bet => BigNumber.from(bet.amount));

    return amountBigNumbers.reduce(
      (sum, value) => sum.add(value),
      ethers.constants.Zero
    );
  }, [betsData, totalBets]);

  //Largest bet used on the market page
  const largestBet = useMemo(() => {
    if (!betsData) return;
    if (!totalBets) return utils.mocks.getMockBet();

    return betsData.reduce((prev, curr) =>
      BigNumber.from(curr.amount).gt(BigNumber.from(prev.amount)) ? curr : prev
    );
  }, [betsData, totalBets]);

  return {
    totalBets,
    totalVolume,
    largestBet
  };
};
