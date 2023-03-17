import { createContext, useContext, useMemo, useRef, useState } from "react";
import { WagmiNetworkRefetchContextType } from "../types/context";

export const WagmiNetworkRefetchContext =
  createContext<WagmiNetworkRefetchContextType>({
    setGlobalChain: (_: number) => {}
  });

export const useWagmiNetworkRefetch = () =>
  useContext(WagmiNetworkRefetchContext);

export const WagmiNetworkRefetchProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [globalChainId, setGlobalChainId] = useState<number>();

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
