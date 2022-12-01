import Navigation from "./Navigation";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";
import ApolloProvider from "./providers/Apollo";
import { ConfigProvider } from "./providers/Config";

const App = () => (
  <ConfigProvider>
    <WagmiProvider>
      <WalletModalProvider>
        <ApolloProvider>
          <Navigation />
        </ApolloProvider>
      </WalletModalProvider>
    </WagmiProvider>
  </ConfigProvider>
);

export default App;
