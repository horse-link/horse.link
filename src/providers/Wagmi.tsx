import { configureChains, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import constants from "../constants";
import { useHorseLinkConnector } from "../hooks/useHorseLinkConnector";

const { chains, provider, webSocketProvider } = configureChains(
  constants.blockchain.CHAINS,
  // [
  //   alchemyProvider({
  //     apiKey: constants.env.ALCHEMY_KEY
  //   }),
  //   publicProvider()
  // ]
  [
    jsonRpcProvider({
      rpc: chain => ({
        chainId: chain.id,
        http: `${constants.env.RPC_URL}`
      })
    })
  ]
);

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const HorseLinkWallet = useHorseLinkConnector(chains);

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
      HorseLinkWallet
    ],
    provider,
    webSocketProvider
  });

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};
