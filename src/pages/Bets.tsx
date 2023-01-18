import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSubgraphBets } from "../hooks/subgraph";
import { Toggle, PageLayout, Card } from "../components";
import { BetFilterGroup } from "../components/Bets";
import { BetTable } from "../components/Tables";
import { SettleBetModal } from "../components/Modals";
import { BetFilterOptions, BetHistory } from "../types/bets";
import { useConfig } from "../providers/Config";
import utils from "../utils";
import { ethers } from "ethers";
import { useBetsStatistics } from "../hooks/stats";

export const Bets: React.FC = () => {
  const { totalWinningBets, totalWinningVolume, largestWinningBet } =
    useBetsStatistics();
  const [myBetsEnabled, setMyBetsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [betTableFilter, setBetTableFilter] =
    useState<BetFilterOptions>("ALL_BETS");

  const { isConnected } = useAccount();

  const config = useConfig();

  const { betHistory, refetch } = useSubgraphBets(
    myBetsEnabled,
    betTableFilter
  );

  useEffect(() => {
    setMyBetsEnabled(isConnected);
  }, [isConnected]);

  const onMyBetToggle = () => setMyBetsEnabled(prev => !prev);
  const onFilterChange = (option: BetFilterOptions) =>
    setBetTableFilter(option);

  const isLoading = !betHistory;
  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row w-full justify-center text-left gap-x-1 gap-y-2 lg:gap-x-4 mb-4 lg:justify-between">
        <Card
          title="24H Winning Bets Value"
          data={
            totalWinningVolume &&
            `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatEther(totalWinningVolume)
            )}`
          }
        />
        <Card title="24H Winning Bets" data={totalWinningBets?.toString()} />
        <Card
          title="24H Largest Winning Bet"
          data={
            largestWinningBet &&
            `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatEther(largestWinningBet.payout)
            )}`
          }
        />
      </div>
      <div className="w-full lg:justify-between lg:flex p-3 mb-3">
        <h3 className="text-lg font-medium text-gray-900 flex items-center my-3">
          Bets History
        </h3>
        <div className="flex my-3">
          <BetFilterGroup
            value={betTableFilter}
            onChange={onFilterChange}
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-3 items-center">
          <Toggle enabled={myBetsEnabled} onChange={onMyBetToggle} />
          <div className="font-semibold">My Bets</div>
        </div>
      </div>
      <BetTable
        myBetsEnabled={myBetsEnabled}
        betHistory={betHistory}
        config={config}
        setSelectedBet={setSelectedBet}
        setIsModalOpen={setIsModalOpen}
      />
      <SettleBetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedBet={selectedBet}
        refetch={refetch}
        config={config}
      />
    </PageLayout>
  );
};
