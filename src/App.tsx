import Navigation from "./Navigation";
import { GlobalErrorProvider } from "./providers/GlobalError";
import { WagmiProvider } from "./providers/Wagmi";
import { WalletModalProvider } from "./providers/WalletModal";

const App = () => {
  return (
    <GlobalErrorProvider>
      <WagmiProvider>
        <WalletModalProvider>
          <Navigation />
        </WalletModalProvider>
      </WagmiProvider>
    </GlobalErrorProvider>
  );
};

export default App;
