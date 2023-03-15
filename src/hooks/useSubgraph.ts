import { gql, useQuery } from "@apollo/client";
import { useApolloContext } from "../providers/Apollo";

const useSubgraph = <T>(query: string) => {
  const client = useApolloContext();

  const gqlQuery = gql(query);

  const { loading, error, data, refetch } = useQuery<T>(gqlQuery, {
    client
  });

  return {
    loading,
    data,
    error,
    refetch
  };
};

export default useSubgraph;
