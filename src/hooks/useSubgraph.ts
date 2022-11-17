import { DocumentNode, useQuery } from "@apollo/client";

const useSubgraph = <T>(gqlQuery: DocumentNode) => {
  const { loading, error, data } = useQuery<T>(gqlQuery);

  return {
    loading,
    data,
    error
  };
};

export default useSubgraph;
