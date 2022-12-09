import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRunnersData } from "../hooks/data";
import { useAccount } from "wagmi";
import { useWalletModal } from "../providers/WalletModal";
import moment from "moment";
import { RaceTable } from "../components/Races";
import { PlaceBetModal, SettleBetModal } from "../components/Modals";
import utils from "../utils";
import { Runner } from "../types/meets";
import { PageLayout } from "../components";
import { useSubgraphBets } from "../hooks/subgraph";
import { BetHistory } from "../types/bets";
import { BetTable } from "../components/Bets";
import { makeMarketId } from "../utils/markets";
import { formatBytes16String } from "../utils/formatting";

export const Races: React.FC = () => {
  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettleModalOpen, setSettleIsModalOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();
  const [selectedBet, setSelectedBet] = useState<BetHistory>();

  const { runners } = useRunnersData(track, raceNumber);
  const meetDate = moment().format("DD-MM-YY");
  const marketId = makeMarketId(new Date(), track, raceNumber.toString());
  const b16MarketId = formatBytes16String(marketId);

  const { betHistory, refetch } = useSubgraphBets(
    false,
    "ALL_BETS",
    b16MarketId
  );

  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const openDialog = () => {
    if (!isConnected) return openWalletModal();

    setIsModalOpen(true);
  };

  const onClickRunner = (runner?: Runner) => {
    if (!runner) return;
    setSelectedRunner(runner);
    openDialog();
  };

  const onClickBet = (betData?: BetHistory) => {
    if (!betData) return;
    if (!isConnected) return openWalletModal();
    setSelectedBet(betData);
    setSettleIsModalOpen(true);
  };

  return (
    <PageLayout>
      <PlaceBetModal
        runner={selectedRunner}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="flex flex-col gap-6">
        <div className="flex p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
          <h1>Track: {track}</h1>
          <h1>Race #: {raceNumber}</h1>
          <h1>Date: {meetDate}</h1>
        </div>
        <RaceTable
          runners={runners || utils.mocks.getMockRunners()}
          onClickRunner={onClickRunner}
        />
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold mt-4">Race Bet History</h1>
        <BetTable
          myBetsEnabled={false}
          onClickBet={onClickBet}
          betHistory={betHistory}
        />
        <SettleBetModal
          isModalOpen={isSettleModalOpen}
          setIsModalOpen={setSettleIsModalOpen}
          selectedBet={selectedBet}
          refetch={refetch}
        />
      </div>
    </PageLayout>
  );
};
