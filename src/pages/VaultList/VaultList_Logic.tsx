import VaultListView from "./VaultList_View";
import { useNavigate } from "react-router-dom";
import useVaults from "../../hooks/useVaults";
import { useState } from "react";

const VaultList: React.FC = () => {
  const { vaultAddresses } = useVaults();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const onClickVault = (vaultAddress: string) => {
    openDialog();
    // navigate(`/vaults/${vaultAddress}`);
  };

  return (
    <VaultListView
      vaultAddressList={vaultAddresses}
      onClickVault={onClickVault}
      isDialogOpen={isDialogOpen}
      onCloseDialog={() => setIsDialogOpen(false)}
    />
  );
};

export default VaultList;
