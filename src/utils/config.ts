import { Config } from "../types/config";

export const getTokenFromSymbol = (symbol: string, config?: Config) =>
  config?.tokens.find(
    token => token.symbol.toLowerCase() === symbol.toLowerCase()
  );

export const isUsdt = (address: string, config?: Config) =>
  getTokenFromSymbol("USDT", config)?.address.toLowerCase() ===
  address.toLowerCase();

export const getVaultNameFromMarket = (
  marketAddress: string,
  config?: Config
) =>
  config?.vaults.find(
    vault => vault.marketAddress.toLowerCase() === marketAddress.toLowerCase()
  )?.name;
