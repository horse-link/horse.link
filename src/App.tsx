import Navigation from "./Navigation";
import { GlobalErrorProvider } from "./providers/GlobalError";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";
import ApolloProvider from "./providers/Apollo";

const App = () => {
  return (
    <GlobalErrorProvider>
      <WagmiProvider>
        <WalletModalProvider>
          <ApolloProvider>
            <Navigation />
          </ApolloProvider>
        </WalletModalProvider>
      </WagmiProvider>
    </GlobalErrorProvider>
  );
};

export default App;
