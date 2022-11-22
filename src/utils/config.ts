import { Config } from "../types/config";

export const getTokenBySymbol = (symbol: string, config?: Config) =>
  config?.tokens.find(
    token => token.symbol.toLowerCase() === symbol.toLowerCase()
  );

export const isUsdt = (address: string, config?: Config) =>
  getTokenBySymbol("USDT", config)?.symbol.toLowerCase() ===
  address.toLowerCase();
