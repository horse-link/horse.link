import { useContractRead, useContractReads } from "wagmi";
import registryContractJson from "../../abi/Registry.json";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useConfig } from "../../providers/Config";
import api from "../../apis/Api";

const useMarketAddressesFromContract = () => {
  const config = useConfig();
  const registryContractAddress = config?.addresses?.registry;
  if (!registryContractAddress)
    throw new Error("No REGISTRY_CONTRACT provided");

  const registryContract = {
    address: registryContractAddress,
    abi: registryContractJson.abi
  };

  const { data } = useContractRead({
    ...registryContract,
    functionName: "marketCount"
  });
  const marketCountData = data as BigNumber;
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
  useEffect(() => {
    const load = async () => {
      const marketAddresses = await api.getMarketAddresses();
      setMarketAddresses(marketAddresses);
    };
    load();
  }, []);

  return { marketAddresses: marketAddresses as unknown as string[] };
};

const shouldUseAPI = process.env.VITE_REST_FOR_MARKETS;

const useMarkets = () => {
  if (shouldUseAPI) {
    const { marketAddresses } = useMarketAddressesFromAPI();
    return { marketAddresses };
  }
  const { marketAddresses } = useMarketAddressesFromContract();
  return { marketAddresses };
};

export default useMarkets;
