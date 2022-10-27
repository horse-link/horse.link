import { ethers } from "ethers";
import { useContractReads } from "wagmi";
import vaultContractJson from "../../abi/Vault.json";

const useVaultData = (vaultAddress: string, userAddress: string) => {
  const vaultContract = {
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi
  };
  const { data: vaultData, refetch } = useContractReads({
    contracts: [
      {
        ...vaultContract,
        functionName: "totalAssets"
      },
      {
        ...vaultContract,
        functionName: "balanceOf",
        args: [userAddress]
      },
      {
        ...vaultContract,
        functionName: "getPerformance"
      },
      {
        ...vaultContract,
        functionName: "decimals"
      },
      {
        ...vaultContract,
        functionName: "asset"
      }
    ]
  });
  const [bnVaultBalance, bnUserBalance, bnPerformance, decimals, asset] =
    vaultData ?? [];
  const vaultBalance =
    bnVaultBalance && ethers.utils.formatUnits(bnVaultBalance, decimals);
  const userBalance =
    bnUserBalance && ethers.utils.formatUnits(bnUserBalance, decimals);
  const performance =
    bnPerformance && ethers.utils.formatUnits(bnPerformance, 4);
  const _asset = asset && String(asset);
  return {
    vaultBalance,
    userBalance,
    performance,
    _asset,
    refetch
  };
};

export default useVaultData;
