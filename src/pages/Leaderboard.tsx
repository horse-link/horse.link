import React from "react";
import { Card, PageLayout } from "../components";
import { useLeaderboardStatistics } from "../hooks/stats";
import { LeaderboardTable } from "../components/Tables";
import { useAccount } from "wagmi";
import utils from "../utils";
import { ethers } from "ethers";

const Leaderboard: React.FC = () => {
  const { stats, balances, userStats } = useLeaderboardStatistics();
  const { isConnected } = useAccount();

  return (
    <PageLayout>
      {isConnected && (
        <div className="mb-4 flex w-full flex-col justify-center gap-x-1 gap-y-2 text-left md:flex-row lg:justify-between lg:gap-x-4">
          <Card title="Your Rank" data={userStats?.rank.toString()} />
          <Card
            title="Your Earnings"
            data={
              userStats?.earnings.value
                ? `${utils.formatting.formatToFourDecimalsRaw(
                    ethers.utils.formatEther(userStats.earnings.value)
                  )} HL`
                : undefined
            }
          />
          <Card
            title="Your Balance"
            data={
              userStats?.balance.formatted
                ? `${utils.formatting.formatToFourDecimals(
                    userStats.balance.formatted
                  )} HL`
                : undefined
            }
          />
        </div>
      )}
      <LeaderboardTable stats={stats} balances={balances} />
    </PageLayout>
  );
};

export default Leaderboard;
