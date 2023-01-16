import { useEffect, useState } from "react";
import api from "../../apis/Api";
import { MeetResults } from "../../types/meets";

export const useResultsData = (propositionid: string) => {
  const [results, setResults] = useState<MeetResults>();

  useEffect(() => {
    api.getRaceResult(propositionid).then(setResults);
  }, [propositionid]);

  return results;
};
