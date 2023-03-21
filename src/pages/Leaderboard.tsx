import React, { useState } from "react";
import { Card, PageLayout } from "../components";
import { useLeaderboardStatistics } from "../hooks/stats";
import { LeaderboardTable } from "../components/Tables";
import { useAccount } from "wagmi";
import utils from "../utils";
import { ethers } from "ethers";
import { Countdown } from "../components/Countdown";

const Leaderboard: React.FC = () => {
  const { stats, balances, userStats } = useLeaderboardStatistics();
  const { isConnected } = useAccount();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const userHasNoStats = isConnected && !userStats;

  const earnings = userStats?.earnings.value
    ? `${utils.formatting.formatToFourDecimalsRaw(
        ethers.utils.formatEther(userStats.earnings.value)
      )} HL`
    : undefined;

  const balance = userStats?.balance.formatted
    ? `${utils.formatting.formatToFourDecimals(userStats.balance.formatted)} HL`
    : undefined;

  return (
    <PageLayout>
      {showLeaderboard ? (
        <React.Fragment>
          {isConnected && (
            <div className="mb-4 flex w-full flex-col justify-center gap-x-1 gap-y-2 text-left md:flex-row lg:justify-between lg:gap-x-4">
              <Card
                title="Your Rank"
                data={userHasNoStats ? "N/A" : userStats?.rank.toString()}
              />
              <Card
                title="Your Earnings"
                data={userHasNoStats ? "0" : earnings}
              />
              <Card
                title="Your Balance"
                data={userHasNoStats ? "0" : balance}
              />
            </div>
          )}
          <LeaderboardTable stats={stats} balances={balances} />
        </React.Fragment>
      ) : (
        <Countdown
          large
          containerStyles="mt-12"
          setShowLeaderboard={setShowLeaderboard}
        />
      )}
    </PageLayout>
  );
};

export default Leaderboard;
