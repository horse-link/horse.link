import { chain, useNetwork } from "wagmi";

const SCANNER_MAP: Map<string, string> = new Map([
  ["goerli", "https://goerli.etherscan.io"],
  ["arbitrum", "https://arbiscan.io"]
]);

export const useScannerUrl = () => {
  const network = useNetwork();
  const rawSuffix = network.chain?.name || chain.goerli.name;
  // get rid of extra words
  const suffix = rawSuffix.split(" ")[0].toLowerCase();

  const url = SCANNER_MAP.get(suffix);
  if (!url) throw new Error(`Could not fetch URL for network ${suffix}`);
  return url;
};
