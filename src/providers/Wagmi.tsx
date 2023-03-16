import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import constants from "../constants";
import { HorseLinkWalletConnector } from "../constants/wagmi";
import { useMemo } from "react";

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { chains, provider, webSocketProvider } = useMemo(
    () =>
      configureChains(
        [chain.goerli, chain.arbitrum],
        [
          alchemyProvider({
            apiKey: constants.env.ALCHEMY_KEY
          }),
          publicProvider()
        ]
      ),
    [constants]
  );

  const client = useMemo(
    () =>
      createClient({
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
                ...chains[0],
                name: chains[0].name.toLowerCase(),
                chainId: chains[0].id
              },
              apiKey: constants.env.ALCHEMY_KEY
            }
          })
        ],
        provider,
        webSocketProvider
      }),
    [constants, chain, provider, webSocketProvider]
  );

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};
