import React from "react";
import { providers } from "ethers";
import { createContext } from "react";

// Imports
import { Connector, Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const infuraId = process.env.REACT_APP_INFURA_ID as string;

// Pick chains
const chains = defaultChains;
const defaultChain = chain.rinkeby; // Change to mainnet for production

// Set up connectors
type ConnectorsConfig = { chainId?: number };
const connectors = ({ chainId }: ConnectorsConfig) => {
  return [new InjectedConnector({ chains })];
};

// Set up providers
type ProviderConfig = { chainId?: number; connector?: Connector };
const isChainSupported = (chainId?: number) =>
  chains.some((x) => x.id === chainId);

// Set up providers
const provider = ({ chainId }: ProviderConfig) =>
  providers.getDefaultProvider(
    isChainSupported(chainId) ? chainId : defaultChain.id,
    {
      infuraId,
    }
  );
const webSocketProvider = ({ chainId }: ConnectorsConfig) =>
  isChainSupported(chainId)
    ? new providers.InfuraWebSocketProvider(chainId, infuraId)
    : undefined;

export type WagmiContextType = {
  connectors: Connector[];
  provider: providers.Provider;
  webSocketProvider: providers.WebSocketProvider | undefined;
};

export const WagmiContext = createContext<WagmiContextType>(null as any);

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider
      autoConnect
      connectors={connectors}
      provider={provider}
      webSocketProvider={webSocketProvider}
    >
      {children}
    </Provider>
  );
};
