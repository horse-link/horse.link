import { useEffect, useState } from "react";
import { Runner, SignedRunnersResponse } from "../../types";
import HorseRaceView from "./HorseRace_View";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router-dom";

type Props = {};

const HorseRace: React.FC<Props> = () => {
  const _runners: Runner[] = [];

  const api = useApi();
  const [response, setResponse] = useState<SignedRunnersResponse>();

  const params = useParams();

  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  useEffect(() => {
    if (!track || !raceNumber) return;
    const load = async () => {
      const runners: SignedRunnersResponse = await api.getRunners(
        track,
        raceNumber
      );
      setResponse(runners);
    };
    load();
  }, [api, track, raceNumber]);

  return (
    <HorseRaceView
      track={track}
      raceNumber={raceNumber}
      runners={response?.data || _runners}
    />
  );
};

export default HorseRace;
