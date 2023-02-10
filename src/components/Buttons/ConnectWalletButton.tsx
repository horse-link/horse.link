import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import { BaseButton } from ".";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  openWalletModal: () => void;
};

export const ConnectWalletButton: React.FC<Props> = ({ openWalletModal }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex items-center justify-center text-sm font-medium">
      {isConnected ? (
        <div className="mt-2 flex flex-col items-center gap-3 sm:mt-0 sm:flex-row">
          <span className="truncate text-gray-500">{address}</span>
          <div>
            <BaseButton
              className="cursor-pointer hover:bg-gray-200 hover:text-white sm:mb-0 sm:w-auto"
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
