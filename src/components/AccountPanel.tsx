import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import utils from "../utils";
import { BaseButton, ConnectWalletButton } from "./Buttons";

export const AccountPanel: React.FC = () => {
  const { disconnect } = useDisconnect();
  const account = useAccount();

  const Image = utils.images.getConnectorIcon(account.connector?.name || "");
  if (!Image)
    throw new Error(
      `Could not find icon for connector ${account.connector?.name}`
    );

  return (
    <div className="mt-6 w-full shadow-lg lg:mx-4 lg:mt-0">
      <h2 className="w-full rounded-t-lg bg-indigo-600 p-6 text-center text-3xl font-bold text-white">
        Account
      </h2>
      {account.isConnected ? (
        <div className="rounded-b-lg bg-white p-2">
          <div className="flex w-full flex-col items-center">
            <div className="w-full px-4 py-2">
              <span className="block text-xl font-bold">Wallet</span>
              <div className="flex w-full items-center gap-x-4">
                <Image className="mx-4 my-6 scale-[2]" />
                <div className="text-ellipsis font-semibold">
                  {account.address}
                </div>
              </div>
            </div>
          </div>
          <BaseButton onClick={() => disconnect()}>Disconnect</BaseButton>
        </div>
      ) : (
        <div className="w-full rounded-b-lg bg-white py-6 text-center">
          <ConnectWalletButton />
        </div>
      )}
    </div>
  );
};
