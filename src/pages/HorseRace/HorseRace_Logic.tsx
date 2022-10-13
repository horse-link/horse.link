import { useEffect, useState } from "react";
import { Runner, SignedRunnersResponse } from "../../types";
import HorseRaceView from "./HorseRace_View";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router-dom";

const HorseRace: React.FC = () => {
  const _runners: Runner[] = [];

  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  const api = useApi();
  const [runners, setRunners] = useState<Runner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!track || !raceNumber) return;
    const load = async () => {
      const { data } = await api.getRunners(track, raceNumber);
      setRunners(data);
    };
    load();
  }, [api, track, raceNumber]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const onClickRunner = (runner: Runner) => {
    openDialog();
  };

  return (
    <HorseRaceView
      track={track}
      raceNumber={raceNumber}
      runners={runners}
      onClickRunner={onClickRunner}
      isDialogOpen={isDialogOpen}
      onCloseDialog={() => setIsDialogOpen(false)}
    />
  );
};

export default HorseRace;
