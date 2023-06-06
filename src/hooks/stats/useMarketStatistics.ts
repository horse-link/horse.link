import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { Bet } from "../../types/subgraph";
import utils from "../../utils";
import { useApi } from "../../providers/Api";

export const useMarketStatistics = () => {
  const api = useApi();
  const [betsData, setBetsData] = useState<Partial<Bet>[]>();

  useEffect(() => {
    api.getMarketStats().then(setBetsData);
  }, []);

  const totalBets = useMemo(() => {
    if (!betsData) return;

    return betsData.length;
  }, [betsData]);

  const totalVolume = useMemo(() => {
    if (!betsData) return;
    if (!totalBets) return ethers.constants.Zero;

    const amountBigNumbers = betsData.map(bet => BigNumber.from(bet.amount));

    return amountBigNumbers.reduce(
      (sum, value) => sum.add(value),
      ethers.constants.Zero
    );
  }, [betsData, totalBets]);

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
