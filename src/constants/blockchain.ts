import { ethers } from "ethers";

export const BYTES_16_ZERO = "0x00000000000000000000000000000000";

export const ONE_ETHER = ethers.utils.parseEther("1");
export type NetworkDetails = {
  name: string;
  id: number;
};
type Networks = { [key: string]: NetworkDetails };
export const networks: Networks = {
  goerli: {
    name: "Goerli",
    id: 5
  },
  sepolia: {
    name: "Sepolia",
    id: 11155111
  },
  arbitrum: {
    name: "Arbitrum",
    id: 42161
  },
  localhost: {
    name: "Localhost",
    id: 1337
  }
};
export function getNetwork(networkName: string): NetworkDetails {
  if (!networkExists(networkName)) {
    throw new Error("Invalid network name");
  }
  return networks[networkName];
}

export function networkExists(networkName: string): boolean {
  return !!networks[networkName];
}
