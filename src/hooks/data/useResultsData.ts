import { useEffect, useState } from "react";
import { MeetResults } from "horselink-sdk";
import { useApi } from "../../providers/Api";

export const useResultsData = (propositionId: string) => {
  const [results, setResults] = useState<MeetResults>();
  const api = useApi();

  useEffect(() => {
    api.getRaceResult(propositionId).then(setResults);
  }, [propositionId]);

  return results;
};
