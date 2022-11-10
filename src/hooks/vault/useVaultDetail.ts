import { BigNumber, ethers } from "ethers";
import { useContractReads } from "wagmi";
import vaultContractJson from "../../abi/Vault.json";
import mockTokenContractJson from "../../abi/MockToken.json";
import { useEffect, useState } from "react";
import { Vault } from "../../types";
import api from "../../apis/Api";

const useVaultDetailFromContract = (vaultAddress: string) => {
  const vaultContract = {
    address: vaultAddress,
    abi: vaultContractJson
  };

  const { data: vaultData } = useContractReads({
    contracts: [
      {
        ...vaultContract,
        functionName: "totalAssets"
      },
      {
        ...vaultContract,
        functionName: "asset"
      }
    ]
  });
  const [bNTotalAssets, tokenAddress] = vaultData ?? [];
  const tokenContract = {
    address: tokenAddress?.toString() || "",
    abi: mockTokenContractJson.abi
  };
  const { data: tokenData } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: "name"
      },
      {
        ...tokenContract,
        functionName: "symbol"
      },
      {
        ...tokenContract,
        functionName: "decimals"
      }
    ],
    enabled: !!tokenAddress
  });
  let vault = {
    name: "",
    symbol: "",
    totalAssets: "",
    address: ""
  };
  if (bNTotalAssets && tokenData) {
    const [name, symbol, decimals] = tokenData;
    vault = {
      name: name as unknown as string,
      symbol: symbol as unknown as string,
      totalAssets: ethers.utils.formatUnits(
        bNTotalAssets as BigNumber,
        decimals as BigNumber
      ),
      address: vaultAddress
    };
  }
  return vault;
};

const useVaultDetailFromAPI = (vaultAddress: string | undefined) => {
  const [vault, setVault] = useState<Vault>();
  useEffect(() => {
    if (!vaultAddress) return;
    const load = async () => {
      const result = await api.getVaultDetail(vaultAddress);
      setVault(result);
    };
    load();
  }, [vaultAddress]);

  return vault;
};

const shouldUseAPI = process.env.REACT_APP_REST_FOR_VAULTS;
const useVaultDetail = (vaultAddress: string): Vault | undefined => {
  if (shouldUseAPI) {
    const vault = useVaultDetailFromAPI(vaultAddress);
    return vault;
  }
  const vaultDetail = useVaultDetailFromContract(vaultAddress);
  return vaultDetail;
};

export default useVaultDetail;
