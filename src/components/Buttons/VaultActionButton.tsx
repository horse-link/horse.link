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
    (type: VaultTransactionType, vault: VaultInfo) =>
      isConnected
        ? setIsModalOpen({
            type,
            vault
          })
        : openWalletModal(),
    [type, vault]
  );

  return (
    <BaseButton
      title={title}
      className="px-4 font-bold border-black border-2 py-1 rounded-md hover:text-white hover:bg-black transition-colors duration-100 mr-4"
      baseStyleOverride
      onClick={() => openModal(type, vault)}
    />
  );
};
