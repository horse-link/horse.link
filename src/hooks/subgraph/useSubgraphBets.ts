import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import api from "../../apis/Api";
import { Bet } from "../../types/subgraph";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import {
  BetFilterOptions,
  BetHistory,
  TotalBetsOnPropositions
} from "../../types/bets";
import { ethers } from "ethers";
import constants from "../../constants";

type Response = {
  bets: Bet[];
};

export const useSubgraphBets = (
  myBetsEnabled: boolean,
  filter: BetFilterOptions,
  marketId?: string
) => {
  const { address } = useAccount();
  const [betHistory, setBetHistory] = useState<BetHistory[]>();

  const { data, refetch } = useSubgraph<Response>(
    utils.queries.getBetsQuery(
      {
        owner: myBetsEnabled && address ? address.toLowerCase() : undefined,
        marketId
      },
      filter
    )
  );

  // refetch data on page load -- prevents stale data
  useEffect(() => {
    const refetchInterval = setInterval(
      refetch,
      constants.time.ONE_SECOND_MS * 5
    );

    return () => clearInterval(refetchInterval);
  }, [marketId]);

  useEffect(() => {
    // local variable to prevent setting state after component unmounts
    // For more information see https://www.developerway.com/posts/fetching-in-react-lost-promises
    let isActive = true;
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
      isActive && setBetHistory(betsByFilterOptions);
    });

    return () => {
      // local variable from above
      isActive = false;
    };
  }, [data, address, filter, marketId]);

  const totalBetsOnPropositions = useMemo(() => {
    if (!betHistory) return;

    const totalBets = betHistory.reduce((prevObject, bet, _, array) => {
      const proposition = utils.formatting.parseBytes16String(
        bet.propositionId
      );

      const amount = ethers.utils
        .parseEther(prevObject[proposition]?.amount || "0")
        .add(ethers.utils.parseEther(bet.amount));

      const totalBetValue = array.reduce(
        (sum, cur) => sum.add(ethers.utils.parseEther(cur.amount)),
        ethers.constants.Zero
      );

      const proportion = amount
        .mul(ethers.constants.WeiPerEther)
        .div(totalBetValue);

      return {
        ...prevObject,
        [proposition]: {
          amount: ethers.utils.formatEther(amount),
          percentage: +ethers.utils.formatEther(proportion) * 100
        }
      };
    }, {} as TotalBetsOnPropositions);

    return totalBets;
  }, [betHistory]);

  return {
    betHistory,
    totalBetsOnPropositions,
    refetch
  };
};
