import React, { createContext, useContext, useMemo } from "react";
import { Api } from "../apis/Api";
import { useNetwork } from "wagmi";

export const ApiContext = createContext(new Api());

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { chain: network } = useNetwork();

  const value = useMemo(() => new Api(network), [network]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
