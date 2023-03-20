import { render } from "@testing-library/react";
import { ApolloProvider } from "../providers/Apollo";
import { WalletModalProvider } from "../providers/WalletModal";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.goerli],
  [publicProvider()]
);

const wagmiClient = createClient({
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
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
