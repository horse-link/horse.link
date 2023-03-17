import React, { createContext, useContext, useEffect, useState } from "react";
import { Config } from "../types/config";
import { useApi } from "./Api";

export const ConfigContext = createContext<Config | undefined>(undefined);

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [config, setConfig] = useState<Config>();
  const api = useApi();

  useEffect(() => {
    setConfig(undefined);
    api.getConfig().then(setConfig);
  }, [api]);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};
