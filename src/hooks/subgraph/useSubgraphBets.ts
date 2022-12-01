import { useEffect, useState } from "react";
import { filterBetsByFilterOptions, getBetHistory } from "../../utils/bets";
import { useAccount } from "wagmi";
import api from "../../apis/Api";
import { BetHistory, FilterOptions } from "../../types";
import { Bet } from "../../types/entities";
import { getBetsQuery } from "../../utils/queries";
import useSubgraph from "../useSubgraph";

type Response = {
  bets: Bet[];
};

const POLL_INTERVAL = 5000;

export const useSubgraphBets = (
  myBetsEnabled: boolean,
  filter: FilterOptions
) => {
  const { address } = useAccount();
  const [betHistory, setBetHistory] = useState<BetHistory[]>();

  const { data, refetch } = useSubgraph<Response>(
    getBetsQuery({ address: myBetsEnabled ? address : undefined, filter })
  );

  // refetch data on page load -- prevents stale data
  useEffect(() => {
    const refetchInterval = setInterval(refetch, POLL_INTERVAL);

    return () => clearInterval(refetchInterval);
  }, []);

  useEffect(() => {
    const missingRequiredParam = myBetsEnabled && !address;
    if (!data || missingRequiredParam) return;
    setBetHistory(undefined);

    Promise.all(
      data.bets.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return getBetHistory(bet, signedBetData);
      })
    ).then(async bets => {
      const betsByFilterOptions = filterBetsByFilterOptions(bets, filter);
      setBetHistory(betsByFilterOptions);
    });
  }, [data, address, filter]);

  return {
    betHistory,
    refetch
  };
};
