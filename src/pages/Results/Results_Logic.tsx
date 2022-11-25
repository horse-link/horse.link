import { Runner } from "../../types";
import ResultsView from "./Results_View";
import { useParams } from "react-router-dom";
import useRunnerData from "../../hooks/data/useRunnerData";

const Results: React.FC = () => {
  const _runners: Runner[] = [];

  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  const { runners } = useRunnerData({ track, raceNumber });

  return <ResultsView runners={runners || _runners} />;
};

export default Results;
