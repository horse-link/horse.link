import { Chain } from "wagmi";
import { useLocalWallet } from "./useLocalWallet";
import { HorseLinkWalletConnector } from "../constants/wagmi";

export const useHorseLinkConnector = (chains: Array<Chain>) => {
  const { wallet, setChain } = useLocalWallet(chains);

  return new HorseLinkWalletConnector({
    chains,
    options: {
      wallet,
      setChain
    }
  });
};
