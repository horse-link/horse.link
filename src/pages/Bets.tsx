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

const Bets: React.FC = () => {
  const config = useConfig();
  const navigate = useNavigate();
  const { owner: paramsAddress } = useParams();
  const { address, isConnected } = useAccount();

  const { totalWinningBets, totalWinningVolume, largestWinningBet } =
    useBetsStatistics();
  const [myBetsEnabled, setMyBetsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [betTableFilter, setBetTableFilter] =
    useState<BetFilterOptions>("ALL_BETS");

  useEffect(() => {
    // redirect back to /bets if disconnected
    if (!isConnected && !paramsAddress)
      navigate("/bets", {
        replace: true
      });
  }, [isConnected]);

  useEffect(() => {
    if (!address) return;

    // if user is logged in navigate to static url
    navigate(`/bets/${address}`, {
      replace: true
    });
    setMyBetsEnabled(true);
  }, [address]);

  const {
    betData: betHistory,
    currentPage,
    incrementPage,
    decrementPage,
    refetch
  } = useSubgraphBets(
    betTableFilter,
    undefined,
    myBetsEnabled ? paramsAddress : undefined
  );

  useEffect(() => {
    setMyBetsEnabled(!!paramsAddress);
  }, [paramsAddress]);

  const onMyBetToggle = () => setMyBetsEnabled(prev => !prev);

  const onFilterChange = (option: BetFilterOptions) =>
    setBetTableFilter(option);

  const isLoading = !betHistory;
  return (
    <PageLayout>
      <div className="mb-4 flex w-full flex-col justify-center gap-x-1 gap-y-2 text-left md:flex-row lg:justify-between lg:gap-x-4">
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
      <div className="mb-3 w-full p-3 lg:flex lg:justify-between">
        <h3 className="my-3 flex items-center text-lg font-medium text-gray-900">
          Bets History
        </h3>
        <div className="my-3 flex">
          <BetFilterGroup
            value={betTableFilter}
            onChange={onFilterChange}
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-3">
          <Toggle enabled={myBetsEnabled} onChange={onMyBetToggle} />
          <div className="font-semibold">My Bets</div>
        </div>
      </div>
      <BetTable
        myBetsEnabled={myBetsEnabled}
        paramsAddressExists={!!paramsAddress}
        betHistory={betHistory}
        config={config}
        setSelectedBet={setSelectedBet}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="mt-2 flex w-full justify-end">
        <div className="flex w-auto items-center gap-x-4 rounded-lg bg-gray-200 px-4 py-2">
          <button
            className="text-[0.8rem] font-semibold uppercase text-gray-600"
            onClick={decrementPage}
          >
            prev
          </button>
          <span className="block text-[1rem] font-semibold uppercase text-gray-600">
            {currentPage}
          </span>
          <button
            className="text-[0.8rem] font-semibold uppercase text-gray-600"
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

export default Bets;
