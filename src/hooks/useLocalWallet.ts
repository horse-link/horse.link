import { ethers } from "ethers";
import { useMemo } from "react";
import utils from "../utils";
import constants from "../constants";
import { Network } from "../types/general";
import { useLocalNetworkContext } from "../providers/LocalNetwork";

const LS_PRIVATE_KEY = "horse.link-wallet-key";

export const useLocalWallet = (chains: Array<Network>) => {
  const { globalId } = useLocalNetworkContext();

  // get keys
  const localKey = localStorage.getItem(LS_PRIVATE_KEY);

  // provider array
  const providers = useMemo(
    () =>
      chains.map(c => {
        const { name, id } = utils.formatting.formatChain(c);

        return new ethers.providers.AlchemyProvider(
          {
            name,
            chainId: id
          },
          constants.env.ALCHEMY_KEY
        );
      }),
    [chains]
  );

  const wallet = useMemo(() => {
    const provider = providers.find(p => p._network.chainId === globalId);
    if (!provider) throw new Error(`No provider available`);

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
  }, [localKey, providers, globalId]);

  return {
    wallet
  };
};
