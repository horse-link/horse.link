import { useState } from "react";
import { Runner } from "../../types";
import HorseRaceView from "./HorseRace_View";
import { useParams } from "react-router-dom";
import useRunnerData from "../../hooks/data/useRunnerData";
const getMockRunners = () => {
  return Array.from({ length: 5 }, () => undefined);
};
const HorseRace: React.FC = () => {
  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();

  const { runners } = useRunnerData({ track, raceNumber });

  const openDialog = () => {
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
