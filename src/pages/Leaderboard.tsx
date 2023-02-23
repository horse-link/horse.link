import React from "react";
import { PageLayout } from "../components";
import { useLeaderboardStatistics } from "../hooks/stats";
import { LeaderboardTable } from "../components/Tables";

const Leaderboard: React.FC = () => {
  const leaderboardData = useLeaderboardStatistics();

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <br />
      <LeaderboardTable stats={leaderboardData} />
    </PageLayout>
  );
};

export default Leaderboard;
