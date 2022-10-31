import React from "react";
import Button from "../Button/Button_View";
import { useAccount, useDisconnect } from "wagmi";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  openWalletModal: () => void;
};

const WalletConnectButton: React.FC<Props> = ({ openWalletModal }) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div
        className={
          isConnecting
            ? "hidden"
            : "inline-flex items-center px-1 text-sm font-medium justify-self-end"
        }
      >
        {isConnected ? (
          <div className="inline-flex items-center mx-2 gap-4">
            <span className="truncate text-gray-500">{address}</span>
            <div>
              <Button
                className="cursor-pointer hover:bg-gray-200 hover:text-white sm:w-auto sm:mb-0"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-4">
            <Button onClick={openWalletModal}>Connect your Wallet</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default WalletConnectButton;
