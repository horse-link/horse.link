import { useContractRead, useContractReads } from "wagmi";
import registryContractJson from "../../abi/Registry.json";
import { ethers } from "ethers";
import useApi from "../useApi";
import { useEffect, useState } from "react";

const registryContract = {
  addressOrName: "0x885386d140e4321102dc218060Bbd55a8B020F4C",
  contractInterface: registryContractJson.abi
};

const useMarketAddressesFromContract = () => {
  const { data: marketCountData } = useContractRead({
    ...registryContract,
    functionName: "marketCount"
  });

  const marketCountStr =
    marketCountData && ethers.utils.formatUnits(marketCountData, 0);
  const marketCount = parseInt(marketCountStr ?? "0");

  const { data: marketsData } = useContractReads({
    contracts: Array.from({ length: marketCount }, (_, i) => {
      return {
        ...registryContract,
        functionName: "markets",
        args: [i]
      };
    })
  });

  const marketAddresses = marketsData?.filter(v => v) ?? [];

  return { marketAddresses: marketAddresses as unknown as string[] };
};

const useMarketAddressesFromAPI = () => {
  const [marketAddresses, setMarketAddresses] = useState<string[]>([]);
  const api = useApi();
  useEffect(() => {
    const load = async () => {
      const marketAddresses = await api.getMarketAddresses();
      setMarketAddresses(marketAddresses);
    };
    load();
  }, [api]);

  return { marketAddresses: marketAddresses as unknown as string[] };
};

const shouldUseAPI = process.env.REACT_APP_REST_FOR_MARKETS;

const useMarkets = () => {
  if (shouldUseAPI) {
    const { marketAddresses } = useMarketAddressesFromAPI();
    return { marketAddresses };
  }
  const { marketAddresses } = useMarketAddressesFromContract();
  return { marketAddresses };
};

export default useMarkets;