import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import Modal from "./Modal";
import ModalBody from "./ModalBody";
import { useConnectWallet } from "../providers/Wagmi";

type Props = {
  isModalOpen: boolean;
  closeWalletModal: () => void;
};

const WalletModal: React.FC<Props> = (props: Props) => {
  const { isModalOpen, closeWalletModal } = props;

  const { isConnected } = useAccount();

  const { connectWallet } = useConnectWallet();

  useEffect(() => {
    if (isConnected) {
      closeWalletModal();
    }
  }, [isConnected, closeWalletModal]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeWalletModal}>
        <ModalBody>
          <div className="w-full">
            <div className="">
              <div className="text-center w-full">
                <div className="">
                  <label
                    className="flex justify-center cursor-pointer"
                    onClick={() => connectWallet()}
                  >
                    <div className="w-40 m-10">
                      <img
                        loading="lazy"
                        alt="MetaMaskLogo"
                        src="/images/metamask.png"
                      />
                    </div>
                  </label>
                  <div className="font-bold">METAMASK</div>
                  <div>Connect using your browser.</div>
                  <div className="my-2 py-4 border-0 border-b border-solid"></div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default WalletModal;
