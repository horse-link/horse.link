import React, { useEffect } from "react";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import { MetaMaskIcon, WalletConnectIcon } from "../../icons";
import { BaseModal } from ".";
import constants from "../../constants";

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

    /*if (
      currentChain.name.toLowerCase() !==
      constants.blockchain.GOERLI_NETWORK.name.toLowerCase()
    ) {
      switchNetwork(constants.blockchain.GOERLI_NETWORK.id);
    } else {
      closeWalletModal();
    }*/
  }, [isConnected, currentChain, switchNetwork]);

  return (
    <BaseModal isOpen={isModalOpen} onClose={closeWalletModal}>
      <div className="text-center sm:w-auto md:w-96">
        {currentChain?.name.toLowerCase() !==
          constants.blockchain.GOERLI_NETWORK.name.toLowerCase() &&
          isConnected && (
            <span className="mb-4 block font-semibold text-red-600">
              Please connect to Goerli to use Horse Link
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
