import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import constants from "../constants";
import { useMemo, useRef } from "react";
import { useHorseLinkConnector } from "../hooks/useHorseLinkConnector";

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const {
    current: { chains, provider, webSocketProvider }
  } = useRef(
    configureChains(
      [chain.goerli, chain.arbitrum],
      [
        alchemyProvider({
          apiKey: constants.env.ALCHEMY_KEY
        }),
        publicProvider()
      ]
    )
  );

  const HorseLinkConnector = useHorseLinkConnector(chains);

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
          HorseLinkConnector
        ],
        provider,
        webSocketProvider
      }),
    [HorseLinkConnector]
  );

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};
