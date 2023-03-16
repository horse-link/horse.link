import { ethers } from "ethers";
import { useMemo, useState } from "react";
import utils from "../utils";
import constants from "../constants";
import { Chain } from "wagmi";

const LS_PRIVATE_KEY = "horse.link-wallet-key";
const LS_CHAIN_KEY = "horse.link-wallet-chain";

export const useLocalWallet = (chains: Array<Chain>) => {
  // get keys
  const localKey = localStorage.getItem(LS_PRIVATE_KEY);
  const [chainId, setChainId] = useState(
    localStorage.getItem(LS_CHAIN_KEY) ?? chains[0].id.toString()
  );

  const provider = useMemo(() => {
    const chain = chains.find(chain => chain.id === +chainId);
    if (!chain) throw new Error(`Could not find chain with id ${chainId}`);

    const { name, id } = utils.formatting.formatChain(chain);

    const alchemyProvider = new ethers.providers.AlchemyProvider(
      {
        name,
        chainId: id
      },
      constants.env.ALCHEMY_KEY
    );

    return alchemyProvider;
  }, [chainId, chains]);

  const wallet = useMemo(() => {
    if (!localKey) {
      const wallet = ethers.Wallet.createRandom();
      const generatedWallet = new ethers.Wallet(wallet.privateKey, provider);

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

  const switchNetwork = (id: number): Chain => {
    const newChain = chains.find(chain => chain.id === id);
    if (!newChain) throw new Error(`No chain found for id ${id}`);

    const newId = newChain.id.toString();

    setChainId(newId);
    localStorage.setItem(LS_CHAIN_KEY, newId);

    return utils.formatting.formatChain(newChain);
  };

  return {
    wallet,
    switchNetwork
  };
};
