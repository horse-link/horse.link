import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRunnersData } from "../hooks/data";
import { useAccount } from "wagmi";
import { useWalletModal } from "../providers/WalletModal";
import moment from "moment";
import { RaceTable } from "../components/Races";
import { PlaceBetModal } from "../components/Modals";
import utils from "../utils";
import { Runner } from "../types/meets";
import { PageLayout } from "../components";

export const Races: React.FC = () => {
  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();

  const { runners } = useRunnersData(track, raceNumber);

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
          <h1>Date: {moment().format("DD-MM-YY")}</h1>
        </div>
        <RaceTable
          runners={runners || utils.mocks.getMockRunners()}
          onClickRunner={onClickRunner}
        />
      </div>
    </PageLayout>
  );
};
