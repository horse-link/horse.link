import { useEffect, useState } from "react";
import api from "../../apis/Api";
import { MeetResults } from "../../types/meets";

export const useResultsData = (marketId: string, state: string) => {
  const [results, setResults] = useState<MeetResults>();

  useEffect(() => {
    api.getRaceResult(marketId, state).then(setResults);
  }, []);

  return results;
};
