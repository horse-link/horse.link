import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { PageLayout, Card } from "../components";
import { BetFilterGroup } from "../components/Bets";
import { BetTable } from "../components/Tables";
import { SettleBetModal } from "../components/Modals";
import { BetFilterOptions, BetHistoryResponse2 } from "../types/bets";
import { useConfig } from "../providers/Config";
import utils from "../utils";
import { ethers } from "ethers";
import { useBetsStatistics } from "../hooks/stats";
import { NewButton } from "../components/Buttons";
import { useBetsData } from "../hooks/data";

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
  const [selectedBet, setSelectedBet] = useState<BetHistoryResponse2>();

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

  const betHistoryRequest = useBetsData();

  const betHistory = useMemo(() => {
    if (!betHistoryRequest?.length || !address) return;

    const getUserbets = address && !allBetsEnabled;

    return getUserbets
      ? betHistoryRequest.filter(
          b => b.punter.toLowerCase() === address.toLowerCase()
        )
      : betHistoryRequest;
  }, [betHistoryRequest, allBetsEnabled, address]);

  const onMyBetToggle = () => setAllBetsEnabled(prev => !prev);

  const onFilterChange = (option: BetFilterOptions) => {
    setBetTableFilter(option);
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
              ethers.utils.formatEther(
                largestWinningBet?.payout || ethers.constants.Zero
              )
            )}`
          }
        />
      </div>
      <div className="my-4 flex w-full justify-between gap-x-3">
        <BetFilterGroup
          value={betTableFilter}
          onChange={onFilterChange}
          disabled={!betHistory}
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
        betHistory={betHistory}
        config={config}
        setSelectedBet={setSelectedBet}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="mt-2 flex w-full justify-end">
        <div className="flex items-center gap-x-4">
          <NewButton
            text="prev"
            onClick={() => {}}
            active={false}
            disabled={!betHistory}
          />
          <p className="px-2 font-semibold">0</p>
          <NewButton text="next" onClick={() => {}} disabled={!betHistory} />
        </div>
      </div>
      <div className="block py-10 lg:hidden" />
      <SettleBetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedBet={selectedBet}
        config={config}
      />
    </PageLayout>
  );
};

export default Bets;
