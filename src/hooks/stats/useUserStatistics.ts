import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { FormattedUser, User } from "../../types/entities";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";

type Response = {
  user: User;
};

export const useUserStatistics = () => {
  const { address } = useAccount();
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getUserStatsQuery(address)
  );

  const formattedUserStats = useMemo<FormattedUser | undefined>(() => {
    if (loading || !data || !address) return;
    if (!data.user) return utils.mocks.getMockUser();

    const user = data.user;

    return {
      id: user.id,
      totalDeposited: BigNumber.from(user.totalDeposited),
      inPlay: BigNumber.from(user.inPlay),
      pnl: BigNumber.from(user.pnl),
      lastUpdate: +user.lastUpdate
    };
  }, [data, loading]);

  return formattedUserStats;
};
