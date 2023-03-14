import { useEffect, useState } from "react";
import { MeetResults } from "../../types/meets";
import { useApi } from "../../providers/Api";

export const useResultsData = (propositionid: string) => {
  const [results, setResults] = useState<MeetResults>();
  const api = useApi();

  useEffect(() => {
    api.getRaceResult(propositionid).then(setResults);
  }, [propositionid]);

  return results;
};
