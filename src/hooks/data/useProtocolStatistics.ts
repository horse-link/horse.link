import { BigNumber } from "ethers";
import { useMemo } from "react";
import { FormattedProtocol, Protocol } from "../../types/entities";
import { getProtocolStatsQuery } from "../../utils/queries";
import useSubgraph from "../useSubgraph";

type Response = {
  protocol: Protocol;
};

const useProtocolStatistics = () => {
  const { data, loading } = useSubgraph<Response>(getProtocolStatsQuery());

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

export default useProtocolStatistics;
