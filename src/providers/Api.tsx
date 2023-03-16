import React, { createContext, useContext, useMemo } from "react";
import { Api } from "../apis/Api";
import { chain, useNetwork } from "wagmi";
import { useWagmiNetworkRefetch } from "./WagmiNetworkRefetch";

// goerli default for now
export const ApiContext = createContext(new Api(chain.goerli));

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { chainId } = useWagmiNetworkRefetch();
  const { chains } = useNetwork();

  const newChain = useMemo(
    () => chains.find(chain => chain.id === chainId),
    [chains, chainId]
  );

  const value = useMemo(() => new Api(newChain || chain.goerli), [newChain]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
