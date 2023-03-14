import React, { useEffect } from "react";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import { MetaMaskIcon, WalletConnectIcon } from "../../icons";
import { BaseModal } from ".";
import api from "../../apis/Api";

type Props = {
  isModalOpen: boolean;
  closeWalletModal: () => void;
};

export const WalletModal: React.FC<Props> = (props: Props) => {
  const { isModalOpen, closeWalletModal } = props;
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (!isConnected || !currentChain || !switchNetwork) return;

    if (currentChain.id !== api.chainDetails.id) {
      switchNetwork(api.chainDetails.id);
    } else {
      closeWalletModal();
    }
  }, [isConnected, currentChain, switchNetwork]);

  return (
    <BaseModal isOpen={isModalOpen} onClose={closeWalletModal}>
      <div className="text-center">
        {currentChain?.id !== api.chainDetails.id && isConnected && (
          <span className="mb-4 block font-semibold text-red-600">
            Please connect to {api.chainDetails.name} to use Horse Link
          </span>
        )}
        <div>
          <label
            className="flex cursor-pointer justify-center"
            onClick={e => {
              e.preventDefault();
              connect({ connector: connectors[0] });
            }}
          >
            <MetaMaskIcon
              title="meta-mask-icon"
              className="h-20 w-20 opacity-100 transition-opacity duration-500 ease-out hover:opacity-40"
            />
          </label>
          <div className="font-bold">METAMASK</div>
          <div>Connect using your browser.</div>
        </div>

        <div className="mb-3 border-0 border-b border-solid py-4"></div>
        <div>
          <label
            className="flex cursor-pointer justify-center"
            onClick={e => {
              e.preventDefault();
              connect({ connector: connectors[1] });
            }}
          >
            <WalletConnectIcon
              title="wallet-connect-icon"
              className="h-20 w-20 opacity-100 transition-opacity duration-500 ease-out hover:opacity-40"
            />
          </label>
          <div className="font-bold">WALLET CONNECT</div>
          <div>Connect using your mobile device.</div>
        </div>
      </div>
    </BaseModal>
  );
};
