import React from "react";
import Button from "../Button/Button_View";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  openWalletModal: () => void;
};

const WalletConnectButton: React.FC<Props> = ({ openWalletModal }) => {
  const { chain } = useNetwork();
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const chainName = chain?.name;
  const isMainnetChain = chainName === "Mainnet";

  return (
    <>
      <div
        className={
          isConnecting
            ? "hidden"
            : "inline-flex items-center px-1 pt-1 text-sm font-medium justify-self-end"
        }
      >
        {isConnected ? (
          <div className="flex mx-2">
            <div className="text-xs p-2 px-4 bg-green-200 font-semibold rounded-xl text-green-600 dark:text-green-400 px-2 m-2 hidden lg:block">
              Connected: {address}
            </div>
            {!isMainnetChain && (
              <div className="text-xs p-2 px-4 bg-red-200 font-semibold rounded-xl text-red-600 dark:text-red-400 px-2 m-2 hidden lg:block">
                Connected Chain: {chainName}
              </div>
            )}
            <div>
              <div className="m-2 flex justify-between">
                <div className="h-6">
                  <Button
                    className="cursor-pointer hover:bg-gray-200 hover:text-white mb-4 sm:w-auto sm:mb-0"
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
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
