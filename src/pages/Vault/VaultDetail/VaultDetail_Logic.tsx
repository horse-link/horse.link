import { useAccount } from "wagmi";
import VaultDetailView from "./VaultDetail_View";
import { useParams } from "react-router-dom";
import useTokenData from "../../../hooks/useTokenData";
import useVaultData from "../../../hooks/useVaultData";

const VaultDetail: React.FC = () => {
  const { vaultAddress: vaultAddressParam } = useParams();
  const { address } = useAccount();

  const vaultAddress = vaultAddressParam || "";
  const userAddress = address || "";

  const { symbol: tokenSymbol } = useTokenData(vaultAddress);

  const { vaultBalance, userBalance, performance, _asset } = useVaultData(
    vaultAddress,
    userAddress
  );

  return (
    <VaultDetailView
      tokenSymbol={tokenSymbol}
      vaultAddress={vaultAddress}
      vaultBalance={vaultBalance}
      userBalance={userBalance}
      performance={performance}
      asset={_asset}
    />
  );
};

export default VaultDetail;
