import React, { createContext, useContext, useMemo } from "react";
import { Api } from "../apis/Api";
import { chain, useNetwork } from "wagmi";
import { useNetworkToggle } from "./NetworkToggle";

// use placeholder default chain -- has no effect
export const ApiContext = createContext(new Api(chain.goerli));

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { chains } = useNetwork();
  const selectedChain = useNetworkToggle();

  const value = useMemo(
    () => new Api(selectedChain || chains[0]),
    [selectedChain]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
