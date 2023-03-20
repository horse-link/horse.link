import Navigation from "./Navigation";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";
import { ApolloProvider } from "./providers/Apollo";
import { ConfigProvider } from "./providers/Config";
import { BetSlipContextProvider } from "./providers/BetSlip";
import { TokenContextProvider } from "./providers/Token";
import { ApiProvider } from "./providers/Api";
import { WagmiNetworkRefetchProvider } from "./providers/WagmiNetworkRefetch";
import { NetworkToggleProvider } from "./providers/NetworkToggle";

const App: React.FC = () => (
  <WagmiNetworkRefetchProvider>
    <WagmiProvider>
      <NetworkToggleProvider>
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
      </NetworkToggleProvider>
    </WagmiProvider>
  </WagmiNetworkRefetchProvider>
);

export default App;
