import { render } from "@testing-library/react";
import { ApolloProvider } from "../providers/Apollo";
import { WalletModalProvider } from "../providers/WalletModal";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import * as chain from "@wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.sepolia],
  [publicProvider()]
);

const wagmiClient = createClient({
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectLegacyConnector({
      chains,
      options: {
        qrcode: true
      }
    })
  ],
  provider
});

const BaseProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <WalletModalProvider>
        <ApolloProvider>{children}</ApolloProvider>
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
