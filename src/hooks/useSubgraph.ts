import { gql, useQuery } from "@apollo/client";

const useSubgraph = <T>(query: string, pollInterval?: number) => {
  const gqlQuery = gql(query);

  const { loading, error, data, refetch } = useQuery<T>(gqlQuery, {
    pollInterval
  });

  return {
    loading,
    data,
    error,
    refetch
  };
};

export default useSubgraph;
