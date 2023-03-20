import { ethers } from "ethers";
import { useMemo, useState } from "react";
import utils from "../utils";
import constants from "../constants";
import { Network } from "../types/general";

const LS_PRIVATE_KEY = "horse.link-wallet-key";

export const useLocalWallet = (chains: Array<Network>) => {
  const [chain, setChain] = useState<Network>(chains[0]);

  // get keys
  const localKey = localStorage.getItem(LS_PRIVATE_KEY);

  const provider = useMemo(() => {
    const newChain = chains.find(c => c.id === +chain.id);
    if (!newChain) throw new Error(`Could not find chain with id ${chain.id}`);

    const { name, id } = utils.formatting.formatChain(newChain);

    const alchemyProvider = new ethers.providers.AlchemyProvider(
      {
        name,
        chainId: id
      },
      constants.env.ALCHEMY_KEY
    );

    return alchemyProvider;
  }, [chain, chains]);

  const wallet = useMemo(() => {
    if (!localKey) {
      const randomWallet = ethers.Wallet.createRandom();
      const generatedWallet = new ethers.Wallet(
        randomWallet.privateKey,
        provider
      );

      const encrypted = utils.general.encryptString(
        generatedWallet.privateKey,
        constants.env.SALT
      );
      localStorage.setItem(LS_PRIVATE_KEY, encrypted);

      return generatedWallet;
    }

    const decrypted = utils.general.decryptString(localKey, constants.env.SALT);
    return new ethers.Wallet(decrypted, provider);
  }, [localKey, provider]);

  return {
    wallet,
    setChain
  };
};
