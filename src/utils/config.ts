import { StaticConfig } from "../providers/Config";

export const isUsdt = (address: string) =>
  StaticConfig.tokenAddresses["USDT"].toLowerCase() === address.toLowerCase();
