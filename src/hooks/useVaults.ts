import { useContractRead, useContractReads } from "wagmi";
import registryContractJson from "../abi/Registry.json";
import { ethers } from "ethers";

const registryContract = {
  addressOrName: "0x5Df377d600A40fB6723e4Bf10FD5ee70e93578da",
  contractInterface: registryContractJson.abi
};

const useVaultAddreses = () => {
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

const useVaults = () => {
  const { vaultAddresses } = useVaultAddreses();
  return { vaultAddresses };
};

export default useVaults;
