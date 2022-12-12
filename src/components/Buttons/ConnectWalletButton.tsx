import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import { BaseButton } from ".";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  openWalletModal: () => void;
};

export const ConnectWalletButton: React.FC<Props> = ({ openWalletModal }) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div
      className={
        isConnecting
          ? "hidden"
          : "flex justify-center items-center text-sm font-medium"
      }
    >
      {isConnected ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 sm:mt-0">
          <span className="truncate text-gray-500">{address}</span>
          <div>
            <BaseButton
              className="cursor-pointer hover:bg-gray-200 hover:text-white sm:w-auto sm:mb-0"
              onClick={() => disconnect()}
            >
              Disconnect
            </BaseButton>
          </div>
        </div>
      ) : (
        <div className="mx-3">
          <BaseButton onClick={openWalletModal}>Connect your Wallet</BaseButton>
        </div>
      )}
    </div>
  );
};
