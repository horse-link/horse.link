import { Config } from "src/types/config";

export const getVaultNameFromMarket = (config: Config, marketAddress: string) =>
  config.vaults.find(
    vault => vault.marketAddress.toLowerCase() === marketAddress.toLowerCase()
  )?.name;
