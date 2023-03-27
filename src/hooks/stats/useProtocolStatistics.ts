import { BigNumber } from "ethers";
import { useMemo } from "react";
import { FormattedProtocol, Protocol } from "../../types/subgraph";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";

type Response = {
  protocol: Protocol;
};

export const useProtocolStatistics = () => {
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getProtocolStatsQuery()
  );

  const formattedData = useMemo<FormattedProtocol | undefined>(() => {
    if (loading || !data) return;

    const protocol = data.protocol;

    return {
      id: protocol?.id ?? "none",
      inPlay: BigNumber.from(protocol?.inPlay ?? 0),
      tvl: BigNumber.from(protocol?.currentTvl ?? 0),
      performance: +protocol?.performance ?? 100,
      lastUpdate: +protocol?.lastUpdate ?? 0
    };
  }, [data, loading]);

  return formattedData;
};
