import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from "@apollo/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import constants from "../constants";
import { chain, useNetwork } from "wagmi";
import { useWagmiNetworkRefetch } from "./WagmiNetworkRefetch";

const ApolloContext = createContext<ApolloClient<NormalizedCacheObject>>(
  new ApolloClient({
    link: new HttpLink({
      uri: constants.env.SUBGRAPH_URL,
      fetch
    }),
    cache: new InMemoryCache()
  })
);

export const useApolloContext = () => useContext(ApolloContext);

export const ApolloProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { globalChainId } = useWagmiNetworkRefetch();
  const { chain: currentChain, chains } = useNetwork();
  const globalChain = useMemo(
    () => chains.find(c => c.id === globalChainId),
    [globalChainId]
  );

  const [selectedChain, setSelectedChain] = useState(currentChain);
  useEffect(() => globalChain && setSelectedChain(globalChain), [globalChain]);

  const rawSuffix = selectedChain?.name.toLowerCase() || chain.goerli.name;
  // strip out extra words
  const suffix = rawSuffix.split(" ")[0].toLowerCase();

  const client = useMemo(
    () =>
      new ApolloClient({
        link: new HttpLink({
          uri: `${constants.env.SUBGRAPH_URL}-${suffix}`,
          fetch
        }),
        cache: new InMemoryCache()
      }),
    [suffix]
  );

  return (
    <ApolloContext.Provider value={client}>{children}</ApolloContext.Provider>
  );
};
