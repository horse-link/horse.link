import { useEffect, useState } from "react";
import { erc20ABI, useContractRead, useContractReads } from "wagmi";
import vaultContractJson from "../../abi/Vault.json";
import { Token } from "../../types";
import useApi from "../useApi";

type useTokenDataArgs = {
  vaultAddress: string;
};

const useTokenDataFromContract = ({ vaultAddress }: useTokenDataArgs) => {
  const { data: vaultData } = useContractRead({
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi,
    functionName: "asset"
  });
  const tokenAddress = vaultData?.toString() ?? "";
  const { data: tokenData } = useContractReads({
    contracts: [
      {
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: "symbol"
      },

      {
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: "decimals"
      }
    ]
  });

  const [tokenSymbol, decimals] = tokenData || [];

  return {
    symbol: tokenSymbol?.toString() ?? "",
    address: tokenAddress,
    decimals: decimals?.toString() ?? "0"
  };
};

const useTokenDataFromAPI = ({ vaultAddress }: useTokenDataArgs) => {
  const [tokenData, setTokenData] = useState<Token>({
    symbol: "",
    address: "",
    decimals: "0"
  });
  const api = useApi();
  useEffect(() => {
    if (!vaultAddress) return;
    const load = async () => {
      const result = await api.getVaultToken(vaultAddress);
      setTokenData(result);
    };
    load();
  }, [api, vaultAddress]);

  return tokenData;
};

const shouldUseAPI = process.env.REACT_APP_REST_FOR_TOKEN;
const useTokenData = (args: useTokenDataArgs): Token => {
  if (shouldUseAPI) {
    return useTokenDataFromAPI(args);
  } else {
    return useTokenDataFromContract(args);
  }
};

export default useTokenData;
