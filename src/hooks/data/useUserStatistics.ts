import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { FormattedUser, User } from "../../types/entities";
import { getMockUser } from "../../utils/mocks";
import { getUserStatsQuery } from "../../utils/queries";
import useSubgraph from "../useSubgraph";

type Response = {
  user: User;
};

const useUserStatistics = () => {
  const { address } = useAccount();
  const { data, loading } = useSubgraph<Response>(getUserStatsQuery(address));

  const formattedUserStats = useMemo<FormattedUser | undefined>(() => {
    if (loading || !data || !address) return;
    if (!data.user) return getMockUser();

    const user = data.user;

    return {
      id: user.id,
      totalDeposited: BigNumber.from(user.totalDesposited),
      inPlay: BigNumber.from(user.inPlay),
      pnl: BigNumber.from(user.pnl),
      lastUpdate: +user.lastUpdate
    };
  }, [data, loading]);

  return formattedUserStats;
};

export default useUserStatistics;
