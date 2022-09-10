import { useEffect, useState } from "react";
import { Runners, SignedRunnersResponse } from "../../types";
import ResultsView from "./Results_View";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router-dom";

type Props = {};

const Results: React.FC<Props> = () => {

  const _runners: Runners[] = [];

  const api = useApi();
  const [response, setResponse] = useState<SignedRunnersResponse>();

  const { track, number } = useParams();

  const load = async () => {
    const runners: SignedRunnersResponse = await api.getRunners(track || "", Number(number) || 0);
    setResponse(runners);
  };

  useEffect(() => {
    load();
  });

  return <ResultsView runners={response?.data || _runners} />;
};

export default ResultsView;
