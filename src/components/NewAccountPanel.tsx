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

type Props = {
  forceNewNetwork: (chain: Chain) => void;
  isLocalWallet: boolean;
};

export const NewAccountPanel: React.FC<Props> = (
  {
    // forceNewNetwork,
    // isLocalWallet
  }
) => {
  const { currentToken, tokensLoading, openModal } = useTokenContext();
  const { hashes } = useBetSlipContext();

  const { openWalletModal } = useWalletModal();
  const account = useAccount();
  const config = useConfig();

  const { data: signer } = useSigner();
  const { getBalance } = useERC20Contract();
  const [userBalance, setUserBalance] = useState<UserBalance>();
  // const { chain, chains } = useNetwork();
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

  const Image = utils.images.getConnectorIcon(account.connector?.name || "");

  return (
    <React.Fragment>
      <Card title="Network" />
    </React.Fragment>
  );
};
