import { useNetwork } from "wagmi";

const SCANNER_MAP: Map<string, string> = new Map([
  ["goerli", "https://goerli.etherscan.io"],
  ["arbitrum", "https://arbiscan.io"]
]);

export const useScannerUrl = () => {
  const network = useNetwork();

  const rawSuffix = network?.chain?.name ?? "goerli";
  // get rid of extra words
  const suffix = rawSuffix.split(" ")[0].toLowerCase();

  const url = SCANNER_MAP.get(suffix) ?? "https://google.com?q=";
  return url;
};
