import {
  chain,
  configureChains,
  createClient,
  useConnect,
  WagmiConfig
} from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
});

export const useConnectWallet = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector({ chains })
  });

  return { connectWallet: connect };
};

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};
