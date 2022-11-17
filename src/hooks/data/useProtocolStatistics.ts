import { gql } from "@apollo/client";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { FormattedProtocol, Protocol } from "../../types/entities";
import useSubgraph from "../useSubgraph";

type Response = {
  protocols: Protocol[];
};

const useProtocolStatistics = () => {
  const GET_PROTOCOLS = gql`
    query GetProtocols {
      protocols {
        id
        inPlay
        initialTvl
        currentTvl
        performance
        lastUpdate
      }
    }
  `;

  const { data, loading } = useSubgraph<Response>(GET_PROTOCOLS);

  const formattedData = useMemo<FormattedProtocol | undefined>(() => {
    if (loading || !data) return;

    // because the id is always "protocol", there is always - and only - one entity
    const protocol = data.protocols[0];

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
