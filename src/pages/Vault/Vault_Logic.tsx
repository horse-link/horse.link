import { useAccount, useContractReads } from "wagmi";
import VaultView from "./Vault_View";
import { ethers } from "ethers";
import { useNavigate, useParams } from "react-router-dom";
import vaultContractJson from "../../abi/Vault.json";
import useTokenData from "../../hooks/useTokenData";

const useVaultData = (vaultAddress: string, userAddress: string) => {
  const vaultContract = {
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi
  };
  const { data: vaultData } = useContractReads({
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
      }
    ]
  });
  const [bnVaultBalance, bnUserBalance, bnPerformance, decimals] =
    vaultData ?? [];
  const vaultBalance =
    bnVaultBalance && ethers.utils.formatUnits(bnVaultBalance, decimals);
  const userBalance =
    bnUserBalance && ethers.utils.formatUnits(bnUserBalance, decimals);
  const performance =
    bnPerformance && ethers.utils.formatUnits(bnPerformance, 4);
  return {
    vaultBalance,
    userBalance,
    performance
  };
};

const Vault: React.FC = () => {
  const { vaultAddress: vaultAddressParam } = useParams();
  const { address } = useAccount();
  const navigate = useNavigate();

  const vaultAddress = vaultAddressParam || "";
  const userAddress = address || "";

  const { symbol: tokenSymbol } = useTokenData(vaultAddress);

  const { vaultBalance, userBalance, performance } = useVaultData(
    vaultAddress,
    userAddress
  );

  const onClickDeposit = () => {
    navigate(`/vaults/${vaultAddress}/deposit`);
  };

  return (
    <VaultView
      tokenSymbol={tokenSymbol}
      vaultAddress={vaultAddress}
      vaultBalance={vaultBalance}
      userBalance={userBalance}
      performance={performance}
      onClickDeposit={onClickDeposit}
    />
  );
};

export default Vault;
