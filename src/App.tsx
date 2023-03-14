import Navigation from "./Navigation";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";
import ApolloProvider from "./providers/Apollo";
import { ConfigProvider } from "./providers/Config";
import { BetSlipContextProvider } from "./providers/BetSlip";
import { TokenContextProvider } from "./providers/Token";
import { ApiProvider } from "./providers/Api";

const App: React.FC = () => (
  <WagmiProvider>
    <ApiProvider>
      <ConfigProvider>
        <WalletModalProvider>
          <ApolloProvider>
            <BetSlipContextProvider>
              <TokenContextProvider>
                <Navigation />
              </TokenContextProvider>
            </BetSlipContextProvider>
          </ApolloProvider>
        </WalletModalProvider>
      </ConfigProvider>
    </ApiProvider>
  </WagmiProvider>
);

export default App;
