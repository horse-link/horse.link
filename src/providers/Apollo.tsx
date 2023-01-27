import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import React from "react";
import constants from "../constants";

const client = new ApolloClient({
  link: new HttpLink({ uri: constants.env.SUBGRAPH_URL, fetch }),
  cache: new InMemoryCache()
});

const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => <ApolloProvider client={client}>{children}</ApolloProvider>;

export { client as ApolloClient };
export default ApolloClientProvider;
