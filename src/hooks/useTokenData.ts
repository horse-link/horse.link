import { erc20ABI, useContractRead, useContractReads } from "wagmi";
import vaultContractJson from "../abi/Vault.json";

const useTokenData = (vaultAddress: string) => {
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
    decimals: decimals?.toString() ?? 0
  };
};

export default useTokenData;
