import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Api } from "../apis/Api";
import { chain, useNetwork } from "wagmi";
import { useWagmiNetworkRefetch } from "./WagmiNetworkRefetch";

// goerli default for now
export const ApiContext = createContext(new Api(chain.goerli));

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { globalChainId } = useWagmiNetworkRefetch();
  const { chain: currentChain, chains } = useNetwork();
  const globalChain = useMemo(
    () => chains.find(c => c.id === globalChainId),
    [globalChainId]
  );

  const [selectedChain, setSelectedChain] = useState(currentChain);
  useEffect(() => globalChain && setSelectedChain(globalChain), [globalChain]);

  const value = useMemo(
    () => new Api(selectedChain || chain.goerli),
    [selectedChain]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
