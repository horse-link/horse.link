import React from "react";
import { useAccount } from "wagmi";
import utils from "../utils";

export const AccountPanel: React.FC = () => {
  const account = useAccount();
  const Image = utils.images.getConnectorIcon(account.connector?.name || "")!;

  return (
    <div className="mt-6 w-full shadow-lg lg:mx-4 lg:mt-0">
      <h2 className="w-full rounded-t-lg bg-indigo-600 p-6 text-center text-3xl font-bold text-white">
        Account
      </h2>
      <div className="rounded-b-lg bg-white p-2">
        <div className="flex w-full flex-col items-center">
          <div className="w-full">
            <span className="block font-semibold">Wallet</span>
            <div>{account.address}</div>
            <div>{account.connector?.name}</div>
            <Image />
          </div>
        </div>
      </div>
    </div>
  );
};
