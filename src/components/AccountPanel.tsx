import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect, useSigner } from "wagmi";
import utils from "../utils";
import { BaseButton, ConnectWalletButton } from "./Buttons";
import { useTokenContext } from "../providers/Token";
import ClipLoader from "react-spinners/ClipLoader";
import { UserBalance } from "../types/users";
import { useERC20Contract } from "../hooks/contracts";
import { ethers } from "ethers";
import { useWalletModal } from "../providers/WalletModal";

export const AccountPanel: React.FC = () => {
  const { currentToken, tokensLoading, openModal } = useTokenContext();

  const { openWalletModal } = useWalletModal();
  const { disconnect } = useDisconnect();
  const account = useAccount();
  const { data: signer } = useSigner();
  const { getBalance } = useERC20Contract();
  const [userBalance, setUserBalance] = useState<UserBalance>();

  useEffect(() => {
    if (!currentToken || !signer) return;

    setUserBalance(undefined);
    getBalance(currentToken.address, signer).then(balance =>
      setUserBalance({
        value: balance,
        decimals: +currentToken.decimals,
        formatted: utils.formatting.formatToFourDecimals(
          ethers.utils.formatUnits(balance, currentToken.decimals)
        )
      })
    );
  }, [currentToken, signer]);

  const panelLoading = tokensLoading || !currentToken || !userBalance;

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
          {panelLoading ? (
            <div className="flex w-full flex-col items-center py-10">
              <ClipLoader />
            </div>
          ) : (
            <React.Fragment>
              <div className="flex w-full flex-col items-center">
                <div className="w-full px-4 py-2">
                  <span className="block text-xl font-bold">Wallet</span>
                  <div className="flex w-full items-center gap-x-4">
                    <Image className="mx-4 my-6 scale-[2]" />
                    <div className="truncate text-ellipsis font-semibold">
                      {account.address}
                    </div>
                  </div>
                  <BaseButton
                    className="mr-4 w-full rounded-md border-2 border-black px-4 py-2 !font-bold text-black transition-colors duration-100 enabled:hover:bg-black enabled:hover:text-white"
                    baseStyleOverride
                    title="CHANGE"
                    onClick={openWalletModal}
                  />
                </div>
                <div className="w-full px-4 py-2">
                  <span className="mb-2 block text-xl font-bold">Token</span>
                  <button
                    className="flex w-full items-center rounded-md border-2 border-black py-1 px-6 hover:bg-zinc-100"
                    onClick={openModal}
                  >
                    <img
                      src={currentToken.src}
                      alt={`${currentToken.symbol} icon`}
                      className="mr-4 h-[2rem]"
                    />
                    <div className="flex flex-col items-start justify-start pt-2">
                      <span className="block text-lg font-semibold">
                        {currentToken.name}
                      </span>
                      <span className="relative bottom-2 block text-black/50">
                        {currentToken.symbol}
                      </span>
                    </div>
                  </button>
                </div>
                <div className="mb-4 w-full px-4 py-2">
                  <span className="mb-2 block text-xl font-bold">Balance</span>
                  <span className="block text-xl font-semibold">
                    {userBalance.formatted} {currentToken.symbol}
                  </span>
                </div>
              </div>
              <BaseButton onClick={() => disconnect()} title="Disconnect" />
            </React.Fragment>
          )}
        </div>
      ) : (
        <div className="w-full rounded-b-lg bg-white py-6 text-center">
          <ConnectWalletButton />
        </div>
      )}
    </div>
  );
};
