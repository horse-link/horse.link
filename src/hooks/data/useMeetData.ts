import { useEffect, useState } from "react";
import { MeetInfo } from "../../types/meets";
import { useApi } from "../../providers/Api";

export const useMeetData = (locationCode: string) => {
  const [results, setResults] = useState<MeetInfo>();
  const api = useApi();

  useEffect(() => {
    api.getMeeting(locationCode).then(setResults);
  }, []);

  return results;
};
