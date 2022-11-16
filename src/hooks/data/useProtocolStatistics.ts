import { BigNumber } from "ethers";
import { useMemo } from "react";
import { FormattedProtocol, Protocol } from "../../types/entities";
import { getPercentDifference } from "../../utils/general";
import useSubgraph from "../useSubgraph";

type Response = {
  protocols: Protocol[];
};

const useProtocolStatistics = () => {
  const query = `{
    protocols {
      id
      inPlay
      initialTvl
      currentTvl
      lastUpdate
    }
  }`;

  const { data, loading } = useSubgraph<Response>(query);

  const formattedData = useMemo<FormattedProtocol | undefined>(() => {
    if (loading || !data) return;

    // because the id is always "protocol", there is always - and only - one entity
    const protocol = data.protocols[0];

    return {
      id: protocol.id,
      inPlay: BigNumber.from(protocol.inPlay),
      tvl: BigNumber.from(protocol.currentTvl),
      performance: getPercentDifference(
        +protocol.currentTvl,
        +protocol.initialTvl
      ),
      lastUpdate: +protocol.lastUpdate
    };
  }, [data, loading]);

  return formattedData;
};

export default useProtocolStatistics;
