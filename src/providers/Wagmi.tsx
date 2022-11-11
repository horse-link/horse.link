import { chain, configureChains, createClient, WagmiConfig } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";

const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
if (!alchemyApiKey) throw new Error("REACT_APP_ALCHEMY_API_KEY is not defined");

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli],
  [
    alchemyProvider({
      apiKey: alchemyApiKey
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
