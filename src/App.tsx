import { SWRConfig } from "swr";
import { ApiProvider } from "./providers/Api";
import Navigation from "./Navigation";
import { GlobalErrorProvider } from "./providers/GlobalError";
import { WagmiProvider } from "./providers/Wagmi";

function App() {
  const swrConfig = {
    fetcher: (url: string) => url,
    shouldRetryOnError: false
  };
  return (
    <SWRConfig value={swrConfig}>
      <GlobalErrorProvider>
        <ApiProvider>
          <WagmiProvider>
            <Navigation />
          </WagmiProvider>
        </ApiProvider>
      </GlobalErrorProvider>
    </SWRConfig>
  );
}

export default App;
