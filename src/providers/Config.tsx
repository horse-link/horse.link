import React, { createContext, useContext, useState } from "react";
import { Config, StaticConfigType } from "../types/config";

export const StaticConfig: StaticConfigType = {
  tokenAddresses: {
    USDT: "0x63B3caA357f1502389AB1F6b43b6FB118473016a",
    DAI: "0xD0B8162d1c0B933EA7087064EcA8544A0Fd14d76"
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
