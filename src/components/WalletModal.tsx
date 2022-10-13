import React, { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskIcon, WalletConnectIcon } from "../icons";
import Modal from "./Modal";

type Props = {
  isModalOpen: boolean;
  closeWalletModal: () => void;
};

const WalletModal: React.FC<Props> = (props: Props) => {
  const { isModalOpen, closeWalletModal } = props;

  const { isConnected } = useAccount();

  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (isConnected) {
      closeWalletModal();
    }
  }, [isConnected, closeWalletModal]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeWalletModal}>
        <div className="text-center w-96">
          <div>
            <label
              className="flex justify-center cursor-pointer"
              onClick={() => connect({ connector: connectors[0] })}
            >
              <MetaMaskIcon className="w-20 h-20 transition-opacity duration-500 ease-out opacity-100 hover:opacity-40" />
            </label>
            <div className="font-bold">METAMASK</div>
            <div>Connect using your browser.</div>
          </div>

          <div className="py-4 mb-3 border-0 border-b border-solid"></div>
          <div>
            <label
              className="flex justify-center cursor-pointer"
              onClick={() => connect({ connector: connectors[1] })}
            >
              <WalletConnectIcon className="w-20 h-20 transition-opacity duration-500 ease-out opacity-100 hover:opacity-40" />
            </label>
            <div className="font-bold">WALLET CONNECT</div>
            <div>Connect using your mobile device.</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WalletModal;
