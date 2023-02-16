import { ethers } from "ethers";
import { useEffect, useState } from "react";

type LocalWallet = {
  mnemonic: string;
  address: string;
};

const loadWallet = () => {
  const raw = localStorage.getItem("local-wallet");
  if (!raw || raw === "undefined") return;
  return JSON.parse(raw) as LocalWallet;
};

const saveWallet = (wallet: LocalWallet) => {
  localStorage.setItem("local-wallet", JSON.stringify(wallet));
};

const createNewWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  const mnemonic = wallet.mnemonic.phrase;
  const address = wallet.address;
  return { mnemonic, address };
};

export const useLocalWallet = () => {
  const [mnemonic, setMnemonic] = useState<string>();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    let wallet = loadWallet();
    if (!wallet) {
      wallet = createNewWallet();
      saveWallet(wallet);
    }
    setMnemonic(wallet.mnemonic);
    setAddress(wallet.address);
  }, []);
  return { mnemonic, address };
};
