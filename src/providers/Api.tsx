import React, { createContext, useContext, useMemo } from "react";
import { Api } from "../apis/Api";
import { useNetwork } from "wagmi";
import constants from "../constants";

// use placeholder default chain -- has no effect
export const ApiContext = createContext(
  new Api(constants.blockchain.CHAINS[0])
);

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { chain } = useNetwork();

  const value = useMemo(
    () => new Api(chain || constants.blockchain.CHAINS[0]),
    [chain]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
