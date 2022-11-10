import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContractReads } from "wagmi";
import vaultContractJson from "../../abi/Vault.json";
import { VaultUserData } from "../../types";
import api from "../../apis/Api";

type UseVaultUserDataArgs = {
  vaultAddress: `0x${string}`;
  userAddress: `0x${string}`;
};
type UseVaultUserDataReturn = VaultUserData & {
  refetch: () => void;
};

const useVaultUserDataFromContract = ({
  vaultAddress,
  userAddress
}: UseVaultUserDataArgs) => {
  const vaultContract = {
    address: vaultAddress,
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
    bnVaultBalance &&
    ethers.utils.formatUnits(
      bnVaultBalance as BigNumber,
      decimals as BigNumber
    );
  const userBalance =
    bnUserBalance &&
    ethers.utils.formatUnits(bnUserBalance as BigNumber, decimals as BigNumber);
  const performance =
    bnPerformance && ethers.utils.formatUnits(bnPerformance as BigNumber, 4);
  return {
    vaultBalance,
    userBalance,
    performance,
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

const shouldUseAPI = process.env.REACT_APP_REST_FOR_VAULTS;
const useVaultUserData = (
  args: UseVaultUserDataArgs
): UseVaultUserDataReturn => {
  return shouldUseAPI
    ? useVaultUserDataFromAPI(args)
    : useVaultUserDataFromContract(args);
};

export default useVaultUserData;
