import { useEffect, useState } from "react";
import api from "../../apis/Api";

export const useResultsData = (marketId: string) => {
  const [results, setResults] = useState<any>();

  useEffect(() => {
    (async () => {
      const apiResults = await api.getRaceResult(marketId);
      console.log(apiResults);
    })();
  }, []);

  return results;
};
