import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import React from "react";

const uri = process.env.VITE_SUBGRAPH_URL;
if (!uri) throw new Error("No subgraph url provided");

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache()
});

const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => <ApolloProvider client={client}>{children}</ApolloProvider>;

export default ApolloClientProvider;
