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
  const { data: totalData, loading: totalDataLoading } = useSubgraph<Response>(
    getBetsQuery(limit, skip),
    POLL_INTERVAL
  );
  // user bets
  const { data: userData, loading: userDataLoading } = useSubgraph<Response>(
    getBetsQuery(limit, skip, address),
    POLL_INTERVAL
  );
  // total bets count
  const { data: countData, loading: countDataLoading } =
    useSubgraph<AggregatorResponse>(getAggregatorQuery(), POLL_INTERVAL);

  // set total bet history state
  useEffect(() => {
    if (totalDataLoading || !totalData) return;

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
  }, [skip, limit, totalData, totalDataLoading]);

  // set user bet history state
  useEffect(() => {
    if (userDataLoading || !userData || !address) return;

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
  }, [skip, limit, address, userData, userDataLoading]);

  // calculate total bet count
  const totalBets = useMemo(() => {
    if (countDataLoading || !countData) return 1;

    return +countData.aggregator.totalBets;
  }, [countData, countDataLoading]);

  // refetch data
  useEffect(() => {
    setTotalBetHistory(undefined);
    setUserBetHistory(undefined);
  }, [skip, limit]);

  return {
    totalBetHistory,
    userBetHistory,
    totalBets
  };
};

export default useBets;
