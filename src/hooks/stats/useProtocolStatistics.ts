import { useEffect, useState } from "react";
import { useApi } from "../../providers/Api";

export const useProtocolStatistics = () => {
  const api = useApi();
  const [result, setResult] = useState<{
    id: "protocol";
    inPlay: number;
    tvl: number;
    performance: number;
    lastUpdate: number;
  }>();

  useEffect(() => {
    api.getPrototcolStats().then(setResult);
  }, []);

  return result;
};
