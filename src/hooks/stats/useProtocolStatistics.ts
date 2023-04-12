import { useEffect, useState } from "react";
import { FormattedProtocol } from "../../types/subgraph";
import { useApi } from "../../providers/Api";

export const useProtocolStatistics = (): FormattedProtocol | undefined => {
  const api = useApi();
  const [result, setResult] = useState<FormattedProtocol>();

  useEffect(() => {
    api.getPrototcolStats().then(setResult);
  }, []);
  return result;
};
