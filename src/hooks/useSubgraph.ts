import { gql, useQuery } from "@apollo/client";

const useSubgraph = <T>(query: string) => {
  const gqlQuery = gql(query);

  const { loading, error, data, refetch } = useQuery<T>(gqlQuery);

  return {
    loading,
    data,
    error,
    refetch
  };
};

export default useSubgraph;
