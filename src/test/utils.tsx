/* eslint-disable import/export */
import { render } from "@testing-library/react";
import { getProvider } from "@wagmi/core";
import ApolloClientProvider from "src/providers/Apollo";
import { WalletModalProvider } from "src/providers/WalletModal";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.goerli],
  [publicProvider()]
);

const wagmiClient = createClient({
  connectors: [new MetaMaskConnector({ chains })],
  provider
});

const BaseProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <WalletModalProvider>
        <ApolloClientProvider>{children}</ApolloClientProvider>
      </WalletModalProvider>
    </WagmiConfig>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: BaseProviders,
    ...options
  });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };
