import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from "@apollo/client";
import React, { createContext, useContext, useMemo } from "react";
import constants from "../constants";
import { chain, useNetwork } from "wagmi";

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
  const network = useNetwork();
  const rawSuffix = network.chain?.name.toLowerCase() || chain.goerli.name;
  // strip out extra words
  const suffix = rawSuffix.split(" ")[0];

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
