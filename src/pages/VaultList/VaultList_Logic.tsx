import VaultListView from "./VaultList_View";
import useVaults from "../../hooks/vault/useVaults";
import { useState } from "react";
import useVaultHistory from "../../hooks/vault/useVaultHistory";

const getMockAddresses = () => {
  return Array.from({ length: 5 }, () => "");
};

const VaultList: React.FC = () => {
  const { vaultAddresses } = useVaults();
  const vaultHistory = useVaultHistory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");

  console.log({ vaultHistory });

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
      vaultHistory={vaultHistory}
    />
  );
};

export default VaultList;
