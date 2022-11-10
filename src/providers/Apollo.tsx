import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import React from "react";

const uri =
  "https://api.thegraph.com/subgraphs/name/horse-link/hl-protocol-goerli";

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache()
});

const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => <ApolloProvider client={client}>{children}</ApolloProvider>;

export default ApolloClientProvider;
