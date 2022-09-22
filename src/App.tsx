import { ApiProvider } from "./providers/Api";
import Navigation from "./Navigation";
import { GlobalErrorProvider } from "./providers/GlobalError";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";

const App = () => {
  return (
    <GlobalErrorProvider>
      <ApiProvider>
        <WagmiProvider>
          <WalletModalProvider>
            <Navigation />
          </WalletModalProvider>
        </WagmiProvider>
      </ApiProvider>
    </GlobalErrorProvider>
  );
};

export default App;
