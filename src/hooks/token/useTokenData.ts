import { useEffect, useState } from "react";
import { erc20ABI, useContractRead, useContractReads } from "wagmi";
import vaultContractJson from "../../abi/Vault.json";
import { Token } from "../../types";
import api from "../../apis/Api";

type useTokenDataArgs = {
  vaultAddress: string;
};

const useTokenDataFromContract = ({ vaultAddress }: useTokenDataArgs) => {
  const { data: vaultData } = useContractRead({
    address: vaultAddress,
    abi: vaultContractJson,
    functionName: "asset"
  });
  const tokenAddress = vaultData?.toString() ?? "";
  const { data: tokenData } = useContractReads({
    contracts: [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "symbol"
      },

      {
        address: tokenAddress,
        abi: erc20ABI,
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
  useEffect(() => {
    if (!vaultAddress) return;
    const load = async () => {
      const result = await api.getVaultToken(vaultAddress);
      setTokenData(result);
    };
    load();
  }, [vaultAddress]);

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
