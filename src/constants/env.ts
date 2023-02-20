import { EnvVariable } from "../types/env";

const getEnvVariable = (name: EnvVariable) => {
  const variable = process.env[name];
  if (!variable) throw new Error(`${name} is not defined`);
  return variable;
};

export const API_URL = getEnvVariable("VITE_API_URL");
export const ALCHEMY_KEY = getEnvVariable("VITE_ALCHEMY_API_KEY");
export const SCANNER_URL = getEnvVariable("VITE_SCANNER_URL");
export const SUBGRAPH_URL = getEnvVariable("VITE_SUBGRAPH_URL");
export const WALLET_NAV_ACTIVE = getEnvVariable("VITE_WALLET_NAV_ACTIVE");
