import Navigation from "./Navigation";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";
import { ApolloProvider } from "./providers/Apollo";
import { ConfigProvider } from "./providers/Config";
import { BetSlipContextProvider } from "./providers/BetSlip";
import { TokenContextProvider } from "./providers/Token";
import { ApiProvider } from "./providers/Api";
import { LocalNetworkProvider } from "./providers/LocalNetwork";

const App: React.FC = () => (
  <WagmiProvider>
    <LocalNetworkProvider>
      <ApiProvider>
        <ConfigProvider>
          <ApolloProvider>
            <WalletModalProvider>
              <BetSlipContextProvider>
                <TokenContextProvider>
                  <Navigation />
                </TokenContextProvider>
              </BetSlipContextProvider>
            </WalletModalProvider>
          </ApolloProvider>
        </ConfigProvider>
      </ApiProvider>
    </LocalNetworkProvider>
  </WagmiProvider>
);

export default App;
