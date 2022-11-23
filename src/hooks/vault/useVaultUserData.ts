import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Address, useContractReads } from "wagmi";
import vaultContractJson from "../../abi/Vault.json";
import { VaultUserData } from "../../types";
import api from "../../apis/Api";

type UseVaultUserDataArgs = {
  vaultAddress: string;
  userAddress: string;
};
type UseVaultUserDataReturn = VaultUserData & {
  refetch: () => void;
};

const useVaultUserDataFromContract = ({
  vaultAddress,
  userAddress
}: UseVaultUserDataArgs) => {
  const vaultContract = {
    address: vaultAddress as Address,
    abi: vaultContractJson
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
        args: [userAddress as Address]
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
    (vaultData as [BigNumber, BigNumber, BigNumber, BigNumber, string]) ?? [];
  const vaultBalance =
    bnVaultBalance && ethers.utils.formatUnits(bnVaultBalance, decimals);
  const userBalance =
    bnUserBalance && ethers.utils.formatUnits(bnUserBalance, decimals);
  const performance =
    bnPerformance && ethers.utils.formatUnits(bnPerformance, 4);
  return {
    vaultBalance: vaultBalance,
    userBalance: userBalance,
    performance: performance,
    asset: asset?.toString() || "",
    refetch
  };
};

const useVaultUserDataFromAPI = ({
  vaultAddress,
  userAddress
}: UseVaultUserDataArgs) => {
  const [vaultUserData, setVaultUserData] = useState({
    vaultBalance: "",
    userBalance: "",
    performance: "",
    asset: ""
  });
  const [fetchIndex, setFetchIndex] = useState(0);
  useEffect(() => {
    if (!vaultAddress || !userAddress) return;
    const load = async () => {
      const result = await api.getVaultUserData(vaultAddress, userAddress);
      setVaultUserData(result);
    };
    load();
  }, [vaultAddress, userAddress, fetchIndex]);
  const refetch = () => setFetchIndex(i => i + 1);
  return { ...vaultUserData, refetch };
};

const shouldUseAPI = process.env.VITE_REST_FOR_VAULTS;
const useVaultUserData = (
  args: UseVaultUserDataArgs
): UseVaultUserDataReturn => {
  return shouldUseAPI
    ? useVaultUserDataFromAPI(args)
    : useVaultUserDataFromContract(args);
};

export default useVaultUserData;
