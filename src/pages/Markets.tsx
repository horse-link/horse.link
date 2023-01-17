import { useMarketStatistics } from "../hooks/stats";
import { ethers } from "ethers";
import utils from "../utils";
import { useConfig } from "../providers/Config";
import { PageLayout, Card } from "../components";
import { MarketTable } from "../components/Tables";

export const Markets: React.FC = () => {
  const config = useConfig();
  const { totalBets, totalVolume, largestBet } = useMarketStatistics();

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row w-full justify-center text-left gap-x-1 gap-y-2 lg:gap-x-4 mb-4 lg:justify-between">
        <Card
          title="24H Volume"
          data={
            totalVolume &&
            `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatEther(totalVolume)
            )}`
          }
        />
        <Card title="24H Bets" data={totalBets?.toString()} />
        <Card
          title="24H Largest Bet"
          data={
            largestBet &&
            `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatEther(largestBet.amount)
            )}`
          }
        />
      </div>
      <MarketTable config={config} />
    </PageLayout>
  );
};
