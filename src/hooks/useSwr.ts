import swr from "swr";
import utils from "../utils";
import constants from "../constants";
import { useApi } from "../providers/Api";

const useSwr = <T>(url: string, interval = constants.time.ONE_SECOND_MS) => {
  const api = useApi();
  const fetcher = utils.general.getAxiosFetcher(api.client);

  const { data, error } = swr<T>(url, fetcher, {
    // refresh data interval
    refreshInterval: interval,
    // even when tab is closed
    refreshWhenHidden: true,
    // also attempt if connection drops
    refreshWhenOffline: true
  });

  return {
    data,
    isLoading: !error && !data,
    error
  };
};

export default useSwr;
