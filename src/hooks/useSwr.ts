import swr from "swr";
import utils from "../utils";

const client = utils.general.getAxiosClient();
const fetcher = utils.general.getAxiosFetcher(client);

const useSwr = <T>(url: string) => {
  const { data, error } = swr<T>(url, fetcher);

  return {
    data,
    isLoading: !error && !data,
    error
  };
};

export default useSwr;
