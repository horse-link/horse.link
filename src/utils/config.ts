import { Config } from "../types/config";

export const isUsdt = (config: Config, address: string) =>
  config?.tokenAddresses["USDT"].toLowerCase() === address.toLowerCase();
