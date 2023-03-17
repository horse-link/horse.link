import { useNetwork } from "wagmi";

export const useScannerUrl = () => {
  const { chain } = useNetwork();
  const url = chain?.blockExplorers?.default.url ?? "https://google.com?q=";
  return url;
};
