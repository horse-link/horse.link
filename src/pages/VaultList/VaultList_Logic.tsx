import VaultListView from "./VaultList_View";
import { useNavigate } from "react-router-dom";
import useVaults from "../../hooks/useVaults";

const VaultList: React.FC = () => {
  const { vaultAddresses } = useVaults();

  const navigate = useNavigate();
  const onClickVault = (vaultAddress: string) => {
    navigate(`/vaults/${vaultAddress}`);
  };

  return (
    <VaultListView
      vaultAddressList={vaultAddresses}
      onClickVault={onClickVault}
    />
  );
};

export default VaultList;
