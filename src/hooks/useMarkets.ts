import { useContractRead, useContractReads } from "wagmi";
import registryContractJson from "../abi/Registry.json";
import { ethers } from "ethers";
import useApi from "./useApi";

const registryContract = {
  addressOrName: "0x5Df377d600A40fB6723e4Bf10FD5ee70e93578da",
  contractInterface: registryContractJson.abi
};

const useMarketAddresses = () => {
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

const useMarketAddressesFromAPI = async () => {
  const api = useApi();
  const marketAddresses = await api.getMarketAddresses();

  return { marketAddresses: marketAddresses as unknown as string[] };
};

const useMarkets = () => {
  const { marketAddresses } = useMarketAddresses();
  return { marketAddresses };
};

export default useMarkets;
