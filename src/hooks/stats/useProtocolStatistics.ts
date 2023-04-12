import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { FormattedProtocol, Protocol } from "../../types/subgraph";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import { useApi } from "../../providers/Api";

type Response = {
  protocol: Protocol;
};

export const useProtocolStatisticsFromGraph = ():
  | FormattedProtocol
  | undefined => {
  // TODO: Consider using API query here -- subgraph is incorrect for Collateralised markets
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getProtocolStatsQuery()
  );

  const formattedData = useMemo<FormattedProtocol | undefined>(() => {
    if (loading || !data) return;

    const protocol = data.protocol;

    return {
      id: protocol?.id ?? "none",
      inPlay: protocol?.inPlay ?? 0,
      tvl: protocol?.currentTvl ?? 0,
      performance: +protocol?.performance ?? 100,
      lastUpdate: +protocol?.lastUpdate ?? 0
    };
  }, [data, loading]);

  return formattedData;
};

export const useProtocolStatistics = (): FormattedProtocol | undefined => {
  const api = useApi();
  const [result, setResult] = useState<FormattedProtocol>();

  useEffect(() => {
    api.getPrototcolStats().then(setResult);
  }, []);
  return result;
};
