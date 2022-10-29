import VaultListView from "./VaultList_View";
import useVaults from "../../hooks/vault/useVaults";
import { useState } from "react";

const getMockAddresses = () => {
  return Array.from({ length: 5 }, () => "");
};

const VaultList: React.FC = () => {
  const { vaultAddresses } = useVaults();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");

  const onClickVault = (vaultAddress: string) => {
    if (!vaultAddress) return;
    setSelectedVaultAddress(vaultAddress);
    setIsDialogOpen(true);
  };

  return (
    <VaultListView
      vaultAddressList={
        vaultAddresses.length > 0 ? vaultAddresses : getMockAddresses()
      }
      onClickVault={onClickVault}
      isDialogOpen={isDialogOpen}
      onCloseDialog={() => setIsDialogOpen(false)}
      selectedVaultAddress={selectedVaultAddress}
    />
  );
};

export default VaultList;
