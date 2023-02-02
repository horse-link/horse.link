import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { Toggle, PageLayout, Card } from "../components";
import { BetFilterGroup } from "../components/Bets";
import { BetTable } from "../components/Tables";
import { SettleBetModal } from "../components/Modals";
import { BetFilterOptions, BetHistory } from "../types/bets";
import { useConfig } from "../providers/Config";
import utils from "../utils";
import { ethers } from "ethers";
import { useBetsStatistics } from "../hooks/stats";
import { useSubgraphBets } from "../hooks/subgraph";

export const Bets: React.FC = () => {
  const config = useConfig();
  const params = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  const { totalWinningBets, totalWinningVolume, largestWinningBet } =
    useBetsStatistics();
  const [myBetsEnabled, setMyBetsEnabled] = useState(true);
  // The punter who's bets we're currently showing (not necessarily the user)
  const [owner, setOwner] = useState(
    params.owner || (myBetsEnabled && address) || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [betTableFilter, setBetTableFilter] =
    useState<BetFilterOptions>("ALL_BETS");

  const {
    betData: betHistory,
    currentPage,
    incrementPage,
    decrementPage,
    refetch
  } = useSubgraphBets(owner, betTableFilter);

  useEffect(() => {
    setMyBetsEnabled(isConnected);
  }, [isConnected]);

  useEffect(() => {
    navigate(owner ? `/bets/${owner}` : "/bets", { replace: true });
  }, [owner]);

  const onMyBetToggle = () => {
    setMyBetsEnabled(prev => {
      setOwner((!prev && address) || "");
      return !prev;
    });
  };

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
      <div className="mt-2 w-full flex justify-end">
        <div className="w-auto bg-gray-200 flex items-center gap-x-4 px-4 py-2 rounded-lg">
          <button
            className="uppercase font-semibold text-gray-600 text-[0.8rem]"
            onClick={decrementPage}
          >
            prev
          </button>
          <span className="block uppercase font-semibold text-gray-600 text-[1rem]">
            {currentPage}
          </span>
          <button
            className="uppercase font-semibold text-gray-600 text-[0.8rem]"
            onClick={incrementPage}
          >
            next
          </button>
        </div>
      </div>
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
