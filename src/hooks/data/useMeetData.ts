import { useEffect, useState } from "react";
import api from "../../apis/Api";
import { MeetInfo } from "../../types/meets";

export const useMeetData = (locationCode: string) => {
  const [results, setResults] = useState<MeetInfo>();

  useEffect(() => {
    api.getMeeting(locationCode).then(setResults);
  }, []);

  return results;
};
