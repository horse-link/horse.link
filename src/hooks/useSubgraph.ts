import { gql, useQuery } from "@apollo/client";

const useSubgraph = <T>(query: string, pollInterval?: number) => {
  const gqlQuery = gql(query);

  const { loading, error, data, refetch } = useQuery<T>(
    gqlQuery,
    pollInterval ? { pollInterval } : undefined
  );

  return {
    loading,
    data,
    error,
    refetch
  };
};

export default useSubgraph;
