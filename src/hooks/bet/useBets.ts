import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import api from "../../apis/Api";
import { BetHistory } from "../../types";
import { Aggregator, Bet } from "../../types/entities";
import { formatBetHistory } from "../../utils/formatting";
import { getAggregatorQuery, getBetsQuery } from "../../utils/queries";
import useSubgraph from "../useSubgraph";

type Response = {
  bets: Bet[];
};

type AggregatorResponse = {
  aggregator: Aggregator;
};

const POLL_INTERVAL = 5000;

const useBets = (limit: number, skip: number) => {
  const { address } = useAccount();
  const [totalBetHistory, setTotalBetHistory] = useState<BetHistory[]>();
  const [userBetHistory, setUserBetHistory] = useState<BetHistory[]>();

  // total bets
  const { data: totalData, refetch: refetchTotal } = useSubgraph<Response>(
    getBetsQuery(limit, skip)
  );
  // user bets
  const { data: userData, refetch: refetchUser } = useSubgraph<Response>(
    getBetsQuery(limit, skip, address)
  );
  // total bets count
  const { data: countData, refetch: refetchCount } =
    useSubgraph<AggregatorResponse>(getAggregatorQuery());

  // refetch function
  const refetch = () => {
    refetchTotal();
    refetchUser();
    refetchCount();
  };

  // refetch data on page load -- prevents stale data
  useEffect(() => {
    const refetchInterval = setInterval(refetch, POLL_INTERVAL);

    return () => clearInterval(refetchInterval);
  }, []);

  // set total bet history state
  useEffect(() => {
    if (!totalData) return;

    // array starts from skip and ends at the limit from the skip
    const filteredTotalData = totalData.bets.filter((_, i) => i < limit);

    // only fetch api data for limited array for efficiency
    Promise.all(
      filteredTotalData.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return formatBetHistory(bet, signedBetData);
      })
    ).then(setTotalBetHistory);
  }, [skip, limit, totalData]);

  // set user bet history state
  useEffect(() => {
    if (!userData || !address) return;

    const filteredUserData = userData.bets.filter((_, i) => i < limit);

    Promise.all(
      filteredUserData.map<Promise<BetHistory>>(async bet => {
        const signedBetData = await api.requestSignedBetData(
          bet.marketId,
          bet.propositionId
        );

        return formatBetHistory(bet, signedBetData);
      })
    ).then(setUserBetHistory);
  }, [skip, limit, address, userData]);

  // calculate total bet count
  const totalBets = useMemo(() => {
    if (!countData) return 1;

    return +countData.aggregator.totalBets;
  }, [countData]);

  // refetch data
  useEffect(() => {
    setTotalBetHistory(undefined);
    setUserBetHistory(undefined);
  }, [skip, limit]);

  return {
    totalBetHistory,
    userBetHistory,
    totalBets,
    refetch
  };
};

export default useBets;
