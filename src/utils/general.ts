import axios, { AxiosInstance } from "axios";
import constants from "../constants";
import { Network } from "../types/general";

// default network will be goerli
export const getAxiosClient = (currentNetwork?: Network) =>
  axios.create({
    baseURL: constants.env.API_URL,
    headers: {
      Accept: "application/json",
      "chain-id": currentNetwork ? currentNetwork.id : undefined
    }
  });

export const getAxiosFetcher = (client: AxiosInstance) => {
  const fetcher = async <T>(url: string) => (await client.get<T>(url)).data;
  return fetcher;
};
