import { Market } from "../types";
import marketContractJson from "../abi/Market.json";
import vaultContractJson from "../abi/Vault.json";
import { useContractRead, useContractReads } from "wagmi";
import useApi from "./useApi";
import { useEffect, useState } from "react";

const useMarketDetailFromContract = (marketAddress?: string) => {
  const marketContract = {
    addressOrName: marketAddress?.toString() || "",
    contractInterface: marketContractJson.abi
  };
  const { data: marketData } = useContractReads({
    contracts: [
      {
        ...marketContract,
        functionName: "getTarget"
      },
      {
        ...marketContract,
        functionName: "getTotalInPlay"
      },
      {
        ...marketContract,
        functionName: "getVaultAddress"
      }
    ],
    enabled: !!marketAddress
  });
  const [target, totalInPlay, vaultAddress] = marketData ?? [];
  const { data: vaultName } = useContractRead({
    addressOrName: vaultAddress?.toString() ?? "",
    contractInterface: vaultContractJson.abi,
    functionName: "name",
    enabled: !!vaultAddress
  });
  return { target, totalInPlay, vaultAddress, name: vaultName };
};

const useMarketDetailFromAPI = (marketAddress: string | undefined) => {
  const [market, setMarket] = useState<Market>();
  const api = useApi();
  useEffect(() => {
    if (!marketAddress) return;
    const load = async () => {
      const result = await api.getMarketDetail(marketAddress);
      setMarket(result);
    };
    load();
  }, [api, marketAddress]);

  return market;
};

const shouldUseAPI = process.env.REST_FOR_MARKETS;
const useMarketDetail = (
  marketAddress: string | undefined
): Market | undefined => {
  if (shouldUseAPI) {
    const market = useMarketDetailFromAPI(marketAddress);
    return market;
  }

  const { target, totalInPlay, vaultAddress, name } =
    useMarketDetailFromContract(marketAddress);
  return {
    address: marketAddress?.toString() || "",
    vaultAddress: vaultAddress as any as string,
    name: name as any as string,
    target: Number(target),
    totalInPlay: Number(totalInPlay).toString()
  };
};

export default useMarketDetail;
