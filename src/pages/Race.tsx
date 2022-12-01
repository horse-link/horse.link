import { useState } from "react";
import { Runner } from "../types";
import { useParams } from "react-router-dom";
import useRunnerData from "../hooks/data/useRunnersData";
import { useAccount } from "wagmi";
import { useWalletModal } from "../providers/WalletModal";
import { getMockRunners } from "../utils/mocks";
import { PageLayout } from "../components";
import moment from "moment";
import RunnerTable from "../components/Race/RunnerTable";
import { PlaceBetModal } from "../components/Modals";

type HorseRaceParams = {
  track: string;
  number: string;
};

const Race: React.FC = () => {
  const params = useParams<HorseRaceParams>();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();

  const { runners } = useRunnerData({ track, raceNumber });

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
        <RunnerTable
          runners={runners || getMockRunners()}
          onClickRunner={onClickRunner}
        />
      </div>
    </PageLayout>
  );
};

export default Race;
