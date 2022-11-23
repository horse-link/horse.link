import { useState } from "react";
import { Runner } from "../../types";
import HorseRaceView from "./HorseRace_View";
import { useParams } from "react-router-dom";
import useRunnerData from "../../hooks/data/useRunnerData";
import { useAccount } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";

const getMockRunners = () => {
  return Array.from({ length: 5 }, () => undefined);
};

export type HorseRaceParams = {
  track: string;
  number: string;
};

const HorseRace: React.FC = () => {
  const params = useParams<HorseRaceParams>();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();

  const { runners } = useRunnerData({ track, raceNumber });

  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const openDialog = () => {
    if (!isConnected) return openWalletModal();

    setIsDialogOpen(true);
  };

  const onClickRunner = (runner?: Runner) => {
    if (!runner) return;
    setSelectedRunner(runner);
    openDialog();
  };

  return (
    <HorseRaceView
      track={track}
      raceNumber={raceNumber}
      runners={runners || getMockRunners()}
      onClickRunner={onClickRunner}
      isDialogOpen={isDialogOpen}
      onCloseDialog={() => setIsDialogOpen(false)}
      selectedRunner={selectedRunner}
    />
  );
};

export default HorseRace;
