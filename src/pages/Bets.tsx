import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { PageLayout, Card } from "../components";
import { BetFilterGroup } from "../components/Bets";
import { BetTable } from "../components/Tables";
import { SettleBetModal } from "../components/Modals";
import { BetFilterOptions, BetHistoryResponseNew } from "../types/bets";
import { useConfig } from "../providers/Config";
import utils from "../utils";
import { ethers } from "ethers";
import { useBetsStatistics } from "../hooks/stats";
import { useSubgraphBets } from "../hooks/subgraph";
import { NewButton } from "../components/Buttons";
import useSwr from "../hooks/useSwr";

const Bets: React.FC = () => {
  const config = useConfig();
  const navigate = useNavigate();
  const { owner: paramsAddress } = useParams();
  const { address, isConnected } = useAccount();

  const { totalWinningBets, totalWinningVolume, largestWinningBet } =
    useBetsStatistics();
  const [allBetsEnabled, setAllBetsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    if (!address || paramsAddress) return;

    // if user is logged in navigate to static url
    navigate(`/bets/${address}`, {
      replace: true
    });
    setAllBetsEnabled(true);
  }, [address]);

  const {
    currentPage,
    incrementPage,
    decrementPage,
    refetch,
    setSkipMultiplier
  } = useSubgraphBets(
    betTableFilter,
    undefined,
    allBetsEnabled ? undefined : paramsAddress
  );

  const { data: betHistory, isLoading } =
    useSwr<BetHistoryResponseNew>(`/bets/history`);

  const onMyBetToggle = () => setAllBetsEnabled(prev => !prev);

  const onFilterChange = (option: BetFilterOptions) => {
    setBetTableFilter(option);
    setSkipMultiplier(0);
  };

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
      <div className="my-4 flex w-full justify-between">
        <BetFilterGroup
          value={betTableFilter}
          onChange={onFilterChange}
          disabled={isLoading}
        />
        <NewButton
          text={allBetsEnabled ? "ALL BETS" : "MY BETS"}
          onClick={onMyBetToggle}
          active={!allBetsEnabled}
        />
      </div>
      <BetTable
        allBetsEnabled={allBetsEnabled}
        paramsAddressExists={!!paramsAddress}
        betHistory={betHistory?.results}
        config={config}
        // setSelectedBet={setSelectedBet}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="mt-2 flex w-full justify-end">
        <div className="flex items-center gap-x-4">
          <NewButton
            text="prev"
            onClick={decrementPage}
            active={false}
            disabled={!betHistory}
          />
          <p className="px-2 font-semibold">{currentPage}</p>
          <NewButton
            text="next"
            onClick={incrementPage}
            disabled={!betHistory}
          />
        </div>
      </div>
      <div className="block py-10 lg:hidden" />
      <SettleBetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        // selectedBet={selectedBet}
        refetch={refetch}
        config={config}
      />
    </PageLayout>
  );
};

export default Bets;
