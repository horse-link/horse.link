import { useState } from "react";

const useRefetch = () => {
  const [shouldRefetch, setShouldRefetch] = useState({});
  const refetch = () => setShouldRefetch({});

  return {
    shouldRefetch,
    refetch
  };
};

export default useRefetch;
