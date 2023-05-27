import { useMarketStatistics } from "../hooks/stats";
import { ethers } from "ethers";
import utils from "../utils";
import { PageLayout, Card } from "../components";
import { MarketTable } from "../components/Tables";

const Markets: React.FC = () => {
  const { totalBets, totalVolume, largestBet } = useMarketStatistics();

  return (
    <PageLayout>
      <div className="mb-4 flex w-full flex-col justify-center gap-x-1 gap-y-2 text-left md:flex-row lg:justify-between lg:gap-x-4">
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
      <MarketTable />
      <div className="block py-10 lg:hidden" />
    </PageLayout>
  );
};

export default Markets;
