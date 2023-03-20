import React, { createContext, useContext, useMemo } from "react";
import { Api } from "../apis/Api";
import { useNetwork } from "wagmi";
import * as chain from "@wagmi/chains";

// use placeholder default chain -- has no effect
export const ApiContext = createContext(new Api(chain.goerli));

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { chains, chain } = useNetwork();

  const value = useMemo(() => new Api(chain || chains[0]), [chain]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
