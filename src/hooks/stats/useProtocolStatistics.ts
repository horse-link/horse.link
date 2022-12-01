import { BigNumber } from "ethers";
import { useMemo } from "react";
import { FormattedProtocol, Protocol } from "../../types/entities";
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
      id: protocol.id,
      inPlay: BigNumber.from(protocol.inPlay),
      tvl: BigNumber.from(protocol.currentTvl),
      performance: +protocol.performance,
      lastUpdate: +protocol.lastUpdate
    };
  }, [data, loading]);

  return formattedData;
};
