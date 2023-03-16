import { createContext, useContext, useMemo, useRef, useState } from "react";
import { chain } from "wagmi";

export const WagmiNetworkRefetchContext = createContext({
  setChain: (_: number) => {},
  chainId: chain.goerli.id
});

export const useWagmiNetworkRefetch = () =>
  useContext(WagmiNetworkRefetchContext);

export const WagmiNetworkRefetchProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [chainId, setChainId] = useState(chain.goerli.id);

  const { current: setChain } = useRef((id: number) => setChainId(id));

  const value = useMemo(
    () => ({
      setChain,
      chainId
    }),
    [setChain, chainId]
  );

  return (
    <WagmiNetworkRefetchContext.Provider value={value}>
      {children}
    </WagmiNetworkRefetchContext.Provider>
  );
};
