import { useEffect, useState } from "react";
import api from "../../apis/Api";
import { RacesResponse } from "../../types/meets";

export const useMeetData = (locationCode: string) => {
  const [results, setResults] = useState<RacesResponse>();

  useEffect(() => {
    api.getMeeting(locationCode).then(setResults);
  }, []);

  return results;
};
