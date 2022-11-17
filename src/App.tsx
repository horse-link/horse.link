import Navigation from "./Navigation";
import { GlobalErrorProvider } from "./providers/GlobalError";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";
import ApolloProvider from "./providers/Apollo";
import { ConfigProvider } from "./providers/Config";

const App = () => {
  return (
    <ConfigProvider>
      <GlobalErrorProvider>
        <WagmiProvider>
          <WalletModalProvider>
            <ApolloProvider>
              <Navigation />
            </ApolloProvider>
          </WalletModalProvider>
        </WagmiProvider>
      </GlobalErrorProvider>
    </ConfigProvider>
  );
};

export default App;
