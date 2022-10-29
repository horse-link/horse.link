import { useContractRead, useContractReads } from "wagmi";
import registryContractJson from "../../abi/Registry.json";
import { ethers } from "ethers";
import useApi from "../useApi";
import { useEffect, useState } from "react";

const registryContract = {
  addressOrName: "0x885386d140e4321102dc218060Bbd55a8B020F4C",
  contractInterface: registryContractJson.abi
};

const useVaultAddresesFromContract = () => {
  const { data: vaultCountData } = useContractRead({
    ...registryContract,
    functionName: "vaultCount"
  });

  const vaultCountStr =
    vaultCountData && ethers.utils.formatUnits(vaultCountData, 0);
  const vaultCount = parseInt(vaultCountStr ?? "0");

  const { data: vaultsData } = useContractReads({
    contracts: Array.from({ length: vaultCount }, (_, i) => {
      return {
        ...registryContract,
        functionName: "vaults",
        args: [i]
      };
    })
  });

  const vaultAddresses = vaultsData?.filter(v => v) ?? [];

  return { vaultAddresses: vaultAddresses as unknown as string[] };
};

const useVaultAddresesFromAPI = () => {
  const [vaultAddresses, setVaultAddresses] = useState<string[]>([]);
  const api = useApi();
  useEffect(() => {
    const load = async () => {
      const vaultAddresses = await api.getVaultAddresses();
      setVaultAddresses(vaultAddresses);
    };
    load();
  }, [api]);

  return { vaultAddresses: vaultAddresses as unknown as string[] };
};

const shouldUseAPI = process.env.REACT_APP_REST_FOR_VAULTS;

const useVaults = () => {
  if (shouldUseAPI) {
    const { vaultAddresses } = useVaultAddresesFromAPI();
    return { vaultAddresses };
  }
  const { vaultAddresses } = useVaultAddresesFromContract();
  return { vaultAddresses };
};

export default useVaults;
