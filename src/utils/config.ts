import { Config, MarketInfo } from "../types/config";

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

export const getVault = (vaultAddress: string, config?: Config) =>
  config?.vaults.find(
    vault => vault.address.toLowerCase() === vaultAddress.toLowerCase()
  );

export const getVaultFromMarket = (market?: MarketInfo, config?: Config) =>
  config?.vaults.find(
    vault => vault.address.toLowerCase() === market?.vaultAddress.toLowerCase()
  );
export const getVenueFromConfig = (meeting: string, config?: Config) => {
  const key = Object.keys(config?.locations || {}).find(
    key =>
      config?.locations[key].toLowerCase().replace("-", " ") ===
      meeting.toLowerCase()
  );
  return key;
};
