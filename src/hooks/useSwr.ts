import swr from "swr";
import fetcher from "../utils/fetcher";

const useSwr = <T>(url: string) => {
  const { data, error } = swr<T>(url, fetcher);

  return {
    data,
    isLoading: !error && !data,
    error
  };
};

export default useSwr;
