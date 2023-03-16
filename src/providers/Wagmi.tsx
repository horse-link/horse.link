import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import constants from "../constants";
import { HorseLinkWalletConnector } from "../constants/wagmi";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, chain.arbitrum],
  [
    alchemyProvider({
      apiKey: constants.env.ALCHEMY_KEY
    }),
    publicProvider()
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new HorseLinkWalletConnector({
      chains,
      options: {
        network: {
          name: chain.goerli.name,
          chainId: chain.goerli.id
        },
        apiKey: constants.env.ALCHEMY_KEY
      }
    })
  ],
  provider,
  webSocketProvider
});

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};
