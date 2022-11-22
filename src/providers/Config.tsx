import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../apis/Api";
import { Config } from "../types/config";

export const ConfigContext = createContext<Config | undefined>(undefined);

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [config, setConfig] = useState<Config>();

  useEffect(() => {
    api.getConfig().then(setConfig);
  }, []);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};
