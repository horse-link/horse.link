import swr from "swr";
import utils from "../utils";
import constants from "../constants";
import { useNetwork } from "wagmi";

const useSwr = <T>(url: string, interval = constants.time.ONE_SECOND_MS) => {
  const { chain: network } = useNetwork();
  const isOurApi = url.startsWith("/");

  const client = utils.general.getAxiosClient(isOurApi ? network : undefined);
  const fetcher = utils.general.getAxiosFetcher(client);

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
