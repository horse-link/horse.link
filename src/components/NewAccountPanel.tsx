import React, { useEffect, useState } from "react";
import { Chain, useAccount, useNetwork, useSigner } from "wagmi";
import utils from "../utils";
import { ethers } from "ethers";
import { useBetSlipContext } from "../providers/BetSlip";
import { useWalletModal } from "../providers/WalletModal";
import { useERC20Contract } from "../hooks/contracts";
import { LS_PRIVATE_KEY } from "../hooks/useLocalWallet";
import { useConfig } from "../providers/Config";
import { useTokenContext } from "../providers/Token";
import { UserBalance } from "../types/users";
import constants from "../constants";
import { Card } from "./Card";
import { NewButton } from "./Buttons";
import { AiFillEyeInvisible, AiOutlineQrcode } from "react-icons/ai";
import { QrCodeModal } from "./Modals";
import { Listbox } from "@headlessui/react";

type Props = {
  forceNewNetwork: (chain: Chain) => void;
  isLocalWallet: boolean;
};

export const NewAccountPanel: React.FC<Props> = ({
  forceNewNetwork,
  isLocalWallet
}) => {
  const { currentToken, tokensLoading, openModal } = useTokenContext();
  const { hashes } = useBetSlipContext();

  const { openWalletModal } = useWalletModal();
  const account = useAccount();
  const config = useConfig();

  const { data: signer } = useSigner();
  const { getBalance } = useERC20Contract();
  const [userBalance, setUserBalance] = useState<UserBalance>();
  const { chain, chains } = useNetwork();
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
  }, [currentToken, signer, config, hashes]);

  const panelLoading = tokensLoading || !currentToken || !userBalance;

  return (
    <React.Fragment>
      <div className="flex w-full flex-col gap-y-6">
        <Card
          title="Network"
          data={
            <Listbox>
              <Listbox.Button className="w-full">
                <NewButton
                  big
                  text={chain?.name || "Please connect"}
                  onClick={() => {}}
                />
              </Listbox.Button>
              <Listbox.Options className="pt-2 text-base font-normal">
                {chains.map(chain => (
                  <Listbox.Option key={chain.id} value={chain.id}>
                    <button
                      onClick={() => forceNewNetwork(chain)}
                      className="mt-2 w-full text-center"
                    >
                      {chain.name}
                    </button>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          }
        />
        <Card
          title="Account"
          data={
            <div className="w-full text-base font-normal">
              <div className="mb-2 flex items-center gap-x-2">
                <h3>WALLET ADDRESS</h3>
                {isLocalWallet && (
                  <button onClick={() => setQrCodeModal(true)}>
                    <AiOutlineQrcode className="mr-2 h-[2rem] w-[2rem]" />
                  </button>
                )}
              </div>
              <p className="mb-6 truncate border border-hl-border p-2">
                {account.address}
              </p>
              <h3 className="mb-2">PRIVATE KEY</h3>
              <button
                className="mb-6 w-full truncate border border-hl-border p-2"
                onClick={togglePrivateKey}
              >
                {showPrivateKey ? (
                  privateKey
                ) : (
                  <div className="flex w-full justify-center">
                    <AiFillEyeInvisible size={20} />
                  </div>
                )}
              </button>
              <div className="w-full font-black">
                <NewButton big text="change wallet" onClick={openWalletModal} />
              </div>
            </div>
          }
        />
      </div>
      <QrCodeModal showModal={showQrCodeModal} onClose={closeQrCodeModal} />
    </React.Fragment>
  );
};
