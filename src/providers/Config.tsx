import React, { createContext, useContext, useState } from "react";
import { Config, StaticConfigType } from "../types/config";

export const StaticConfig: StaticConfigType = {
  tokenAddresses: {
    USDT: "0xcF005F728e0c1998373cDB5012eadE8ce604ceff",
    DAI: "0x6B54366642BFE522D647c77C422f1e6E11F02356"
  }
};

export const ConfigContext = createContext<Config | undefined>(undefined);

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [config] = useState<Config>();

  // todo: add async calls for data from contracts / api that is needed in a useEffect

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};
