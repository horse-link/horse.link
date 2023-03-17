import { createContext, useContext, useMemo, useRef, useState } from "react";
import { chain } from "wagmi";

export const WagmiNetworkRefetchContext = createContext({
  setGlobalChain: (_: number) => {},
  globalChainId: chain.goerli.id
});

export const useWagmiNetworkRefetch = () =>
  useContext(WagmiNetworkRefetchContext);

export const WagmiNetworkRefetchProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [globalChainId, setGlobalChainId] = useState(chain.goerli.id);

  const { current: setGlobalChain } = useRef((id: number) =>
    setGlobalChainId(id)
  );

  const value = useMemo(
    () => ({
      setGlobalChain,
      globalChainId
    }),
    [setGlobalChain, globalChainId]
  );

  return (
    <WagmiNetworkRefetchContext.Provider value={value}>
      {children}
    </WagmiNetworkRefetchContext.Provider>
  );
};
