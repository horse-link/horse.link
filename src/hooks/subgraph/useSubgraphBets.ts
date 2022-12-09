import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import api from "../../apis/Api";
import { Bet } from "../../types/entities";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import { BetFilterOptions, BetHistory } from "../../types/bets";

type Response = {
  bets: Bet[];
};

const POLL_INTERVAL = 5000;

export const useSubgraphBets = (
  myBetsEnabled: boolean,
  filter: BetFilterOptions,
  marketId?: string
) => {
  const { address } = useAccount();
  const [betHistory, setBetHistory] = useState<BetHistory[]>();

  const { data, refetch } = useSubgraph<Response>(
    utils.queries.getBetsQuery({
      address: myBetsEnabled ? address : undefined,
      filter,
      marketId: marketId ? marketId : undefined
    })
  );
  console.log("useSubgraphBets", data);

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
        const signedBetData = await api.getWinningResultSignature(
          utils.formatting.parseBytes16String(bet.marketId)
        );

        return utils.bets.getBetHistory(bet, signedBetData);
      })
    ).then(async bets => {
      const betsByFilterOptions = utils.bets.filterBetsByFilterOptions(
        bets,
        filter
      );
      setBetHistory(betsByFilterOptions);
    });
  }, [data, address, filter]);

  return {
    betHistory,
    refetch
  };
};
