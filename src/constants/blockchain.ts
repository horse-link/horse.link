import { ethers } from "ethers";

export const BYTES_16_ZERO = "0x00000000000000000000000000000000";

export const ONE_ETHER = ethers.utils.parseEther("1");

export const GOERLI_NETWORK = {
  name: "Goerli",
  id: 5
};

type Networks = { [key: string]: { name: string; id: number } };
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
  }
};
