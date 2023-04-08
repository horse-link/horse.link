import React, { useCallback } from "react";
import { BaseButton } from ".";
import { VaultModalState, VaultTransactionType } from "../../types/vaults";
import { VaultInfo } from "../../types/config";

type Props = {
  title: string;
  type: VaultTransactionType;
  vault: VaultInfo;
  isConnected: boolean;
  openWalletModal: () => void;
  setIsModalOpen: (state: VaultModalState) => void;
};

export const VaultActionButton: React.FC<Props> = ({
  title,
  type,
  vault,
  isConnected,
  openWalletModal,
  setIsModalOpen
}) => {
  const openModal = useCallback(
    () =>
      isConnected
        ? setIsModalOpen({
            type,
            vault
          })
        : openWalletModal(),
    [type, vault, isConnected]
  );

  return (
    <BaseButton
      title={title}
      className="mr-4 rounded-md border-2 border-black px-4 py-2 font-bold text-black transition-colors duration-100 hover:bg-black hover:text-white"
      baseStyleOverride
      onClick={openModal}
    />
  );
};
