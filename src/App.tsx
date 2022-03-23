import { SWRConfig } from "swr";
import { AuthProvider } from "./providers/Auth";
import { ApiProvider } from "./providers/Api";
import Navigation from "./Navigation";
import { GlobalErrorProvider } from "./providers/GlobalError";

function App() {
  const swrConfig = {
    fetcher: (url: string) => url,
    shouldRetryOnError: false
  };
  return (
    <SWRConfig value={swrConfig}>
      <GlobalErrorProvider>
        <ApiProvider>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </ApiProvider>
      </GlobalErrorProvider>
    </SWRConfig>
  );
}

export default App;
