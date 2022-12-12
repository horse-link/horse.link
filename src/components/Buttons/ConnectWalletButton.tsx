import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import { BaseButton } from ".";
import utils from "../../utils";

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
          : "w-full flex justify-center items-center text-sm font-medium justify-self-end"
      }
    >
      {isConnected && address ? (
        <div className="flex items-center gap-3">
          <span className="text-gray-500">
            {utils.formatting.shortenAddress(address)}
          </span>
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
