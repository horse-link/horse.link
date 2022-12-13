import { BigNumber } from "ethers";
import { Address } from "wagmi";

export type ProtocolAddresses = {
  registry: Address;
  marketOracle: Address;
  ownerAddress: Address;
};

export type TokenInfo = {
  name: string;
  symbol: string;
  address: Address;
  decimals: number;
  owner: Address;
  totalSupply: BigNumber;
};

export type MarketInfo = {
  owner: Address;
  address: Address;
  fee: BigNumber;
  inPlayCount: BigNumber;
  totalExposure: BigNumber;
  totalInPlay: BigNumber;
  vaultAddress: Address;
};

export type VaultInfo = {
  name: string;
  address: Address;
  owner: Address;
  asset: TokenInfo;
  marketAddress: Address;
  performance: BigNumber;
  totalAssets: BigNumber;
  totalSupply: BigNumber;
};

export type Config = {
  addresses: ProtocolAddresses;
  markets: MarketInfo[];
  vaults: VaultInfo[];
  tokens: TokenInfo[];
  locations: Record<string, string>;
};
