import VaultListView from "./VaultList_View";
import useVaults from "../../hooks/useVaults";
import { useState } from "react";

const VaultList: React.FC = () => {
  const { vaultAddresses } = useVaults();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVaultAddress, setselectedVaultAddress] = useState("");

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const onClickVault = (vaultAddress: string) => {
    setselectedVaultAddress(vaultAddress);
    openDialog();
  };

  return (
    <VaultListView
      vaultAddressList={vaultAddresses}
      onClickVault={onClickVault}
      isDialogOpen={isDialogOpen}
      onCloseDialog={() => setIsDialogOpen(false)}
      selectedVaultAddress={selectedVaultAddress}
    />
  );
};

export default VaultList;
