import VaultsView from "./Vaults_View";
import { useNavigate } from "react-router-dom";
import useVaults from "../../hooks/useVaults";

const Vaults: React.FC = () => {
  const { vaultAddresses } = useVaults();

  const navigate = useNavigate();
  const onClickVault = (vaultAddress: string) => {
    navigate(`/vaults/${vaultAddress}`);
  };

  return (
    <VaultsView vaultAddressList={vaultAddresses} onClickVault={onClickVault} />
  );
};

export default Vaults;
