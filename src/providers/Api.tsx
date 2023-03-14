import React, { createContext, useContext, useMemo } from "react";
import { Api } from "../apis/Api";
import { chain, useNetwork } from "wagmi";

// goerli default for now
export const ApiContext = createContext(new Api(chain.goerli));

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { chain: network } = useNetwork();

  const value = useMemo(() => new Api(network || chain.goerli), [network]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
