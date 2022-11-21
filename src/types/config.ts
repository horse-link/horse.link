import { BigNumber } from "ethers";
import { Address } from "wagmi";

export type AssetInfo = {
  symbol: string;
  address: Address;
  decimals: number;
}

export type MarketInfo = {
  owner: Address;
  address: Address;
  fee: BigNumber;
  inPlayCount: BigNumber;
  totalExposure: BigNumber;
  totalInPlay: BigNumber;
  vaultAddress: Address;
}

export type VaultInfo = {
  name: string;
  address: Address;
  owner: Address;
  asset: AssetInfo;
  marketAddress: Address;
  performance: BigNumber;
  totalAssets: BigNumber;
  totalSupply: BigNumber;
}

export type Config = {
  tokenAddresses: Record<string, string>;
  protocol: {
    registry: string;
    marketOracle: string;
    markets: MarketInfo[];
    vaults: VaultInfo[];
  };
};
