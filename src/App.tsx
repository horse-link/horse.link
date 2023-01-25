import Navigation from "./Navigation";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";
import ApolloProvider from "./providers/Apollo";
import { ConfigProvider } from "./providers/Config";
import { BetSlipContextProvider } from "./context/BetSlipContext";

const App: React.FC = () => (
  <ConfigProvider>
    <WagmiProvider>
      <WalletModalProvider>
        <ApolloProvider>
          <BetSlipContextProvider>
            <Navigation />
          </BetSlipContextProvider>
        </ApolloProvider>
      </WalletModalProvider>
    </WagmiProvider>
  </ConfigProvider>
);

export default App;
