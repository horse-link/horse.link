import axios, { AxiosInstance } from "axios";
import constants from "../constants";
import { Network } from "../types/general";
import { chain } from "wagmi";

// default network will be goerli
export const getAxiosClient = (currentNetWork: Network = chain.goerli) =>
  axios.create({
    baseURL: constants.env.API_URL,
    headers: {
      Accept: "application/json",
      "chain-id": currentNetWork.id
    }
  });

export const getAxiosFetcher = (client: AxiosInstance) => {
  const fetcher = async <T>(url: string) => (await client.get<T>(url)).data;
  return fetcher;
};
