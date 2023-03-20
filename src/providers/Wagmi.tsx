import { configureChains, createClient, WagmiConfig } from "wagmi";
import * as chain from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy";
import { alchemyProvider } from "wagmi/providers/alchemy";
import constants from "../constants";
import { HorseLinkWalletConnector } from "../constants/wagmi";
import { useLocalWallet } from "../hooks/useLocalWallet";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, chain.arbitrum],
  [
    alchemyProvider({
      apiKey: constants.env.ALCHEMY_KEY
    }),
    publicProvider()
  ]
);

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { wallet, setChain } = useLocalWallet(chains);

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new WalletConnectLegacyConnector({
        chains,
        options: {
          qrcode: true
        }
      }),
      new HorseLinkWalletConnector({
        chains,
        options: {
          wallet,
          setChain
        }
      })
    ],
    provider,
    webSocketProvider
  });

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};
