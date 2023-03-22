import React, { useEffect, useState } from "react";
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import utils from "../utils";
import { BaseButton } from "./Buttons";
import { useTokenContext } from "../providers/Token";
import ClipLoader from "react-spinners/ClipLoader";
import { UserBalance } from "../types/users";
import { useERC20Contract } from "../hooks/contracts";
import { ethers } from "ethers";
import { useWalletModal } from "../providers/WalletModal";
import { Listbox, Transition } from "@headlessui/react";
import { useApiWithForce } from "../providers/Api";
import { Network } from "../types/general";
import { useApolloWithForce } from "../providers/Apollo";
import { LS_PRIVATE_KEY } from "../hooks/useLocalWallet";
import constants from "../constants";
import { AiFillEyeInvisible, AiFillEye, AiOutlineQrcode } from "react-icons/ai";
import { LOCAL_WALLET_ID } from "../constants/wagmi";
import { QrCodeModal } from "./Modals";

export const AccountPanel: React.FC = () => {
  const { currentToken, tokensLoading, openModal } = useTokenContext();
  const { forceNewChain: forceApi } = useApiWithForce();
  const { forceNewChain: forceApollo } = useApolloWithForce();

  const { openWalletModal } = useWalletModal();
  const account = useAccount();
  const isLocalWallet = account.connector?.id === LOCAL_WALLET_ID;

  const { data: signer } = useSigner();
  const { getBalance } = useERC20Contract();
  const [userBalance, setUserBalance] = useState<UserBalance>();
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [showQrCodeModal, setQrCodeModal] = useState(false);
  const closeQrCodeModal = () => setQrCodeModal(false);

  const [privateKey, setPrivateKey] = useState<string>();
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // get private key
  useEffect(() => {
    const localKey = localStorage.getItem(LS_PRIVATE_KEY);
    if (!localKey) return setPrivateKey(undefined);

    const decrypted = utils.general.decryptString(localKey, constants.env.SALT);
    setPrivateKey(decrypted);
  }, []);

  const togglePrivateKey = () => setShowPrivateKey(prev => !prev);

  useEffect(() => {
    // If the current chain is not in the supported list,
    if (chain && switchNetwork) {
      if (!chains.find(c => c.id === chain.id)) {
        switchNetwork(chains[0].id);
      }
    }
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
  }, [currentToken, signer, chain]);

  const panelLoading = tokensLoading || !currentToken || !userBalance;

  const Image = utils.images.getConnectorIcon(account.connector?.name || "");

  const switchNetworkWithForce = (chain: Network) => {
    switchNetwork?.(chain.id);
    forceApi(chain);
    forceApollo(chain);
  };

  return (
    <React.Fragment>
      <div className="mt-6 w-full shadow-lg lg:mx-4 lg:mt-0">
        {account.isConnected ? (
          <div className="flex w-full justify-between rounded-t-lg bg-indigo-600 p-6 text-white">
            <h2 className="w-full text-center text-3xl font-bold">Account</h2>
            <div className="flex flex-col items-center">
              <Listbox>
                {({ open }) => (
                  <React.Fragment>
                    <Listbox.Button className="rounded-md bg-indigo-700 px-4 py-2 font-semibold">
                      {chain?.name || "Network"}
                    </Listbox.Button>
                    <Transition
                      show={open}
                      as={React.Fragment}
                      enter="transition ease-in duration-100"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-12 mr-20 w-fit rounded-md bg-white p-2 font-semibold text-black shadow-xl">
                        {chains.map(chain => (
                          <Listbox.Option
                            key={chain.id}
                            value={chain.id}
                            className="whitespace-nowrap"
                          >
                            <button
                              onClick={() => switchNetworkWithForce(chain)}
                              className="w-full rounded-md py-2 px-6 hover:bg-gray-100"
                            >
                              {chain.name}
                            </button>
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </React.Fragment>
                )}
              </Listbox>
            </div>
          </div>
        ) : (
          <h2 className="w-full rounded-t-lg bg-indigo-600 p-6 text-center text-3xl font-bold text-white">
            Account
          </h2>
        )}
        {account.isConnected ? (
          <div className="rounded-b-lg bg-white p-2">
            {panelLoading ? (
              <div className="flex w-full flex-col items-center py-10">
                <ClipLoader />
              </div>
            ) : (
              <div className="flex w-full flex-col items-center">
                <div className="w-full px-4 py-2">
                  <span className="block text-xl font-bold">Wallet</span>
                  <div className="flex w-full items-center gap-x-2">
                    {Image && <Image className="mx-4 my-6 scale-[2]" />}
                    <div className="flex items-center truncate font-semibold">
                      {isLocalWallet && (
                        <button onClick={() => setQrCodeModal(true)}>
                          <AiOutlineQrcode className="mr-2 h-[2rem] w-[2rem] shrink-0 grow-0" />
                        </button>
                      )}
                      {account.address}
                    </div>
                  </div>
                  {isLocalWallet && (
                    <div className="mb-2 w-full">
                      <div className="flex w-full items-center gap-x-2">
                        <span className="block font-semibold">Private Key</span>
                        <button onClick={togglePrivateKey}>
                          {showPrivateKey ? (
                            <AiFillEye size={20} />
                          ) : (
                            <AiFillEyeInvisible size={20} />
                          )}
                        </button>
                      </div>
                      {showPrivateKey && (
                        <p className="break-all">{privateKey}</p>
                      )}
                    </div>
                  )}
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
                <div className="w-full px-4 py-2">
                  <span className="mb-2 block text-xl font-bold">Balance</span>
                  <span className="block text-xl font-semibold">
                    {userBalance.formatted} {currentToken.symbol}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full rounded-b-lg bg-white py-6 px-6 text-center">
            <BaseButton title="Connect your Wallet" onClick={openWalletModal} />
          </div>
        )}
      </div>
      <QrCodeModal showModal={showQrCodeModal} onClose={closeQrCodeModal} />
    </React.Fragment>
  );
};
