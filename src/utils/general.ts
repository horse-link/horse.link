import axios, { AxiosInstance } from "axios";
import constants from "../constants";

export const getAxiosClient = () =>
  axios.create({
    baseURL: constants.env.API_URL,
    headers: {
      Accept: "application/json"
    }
  });

export const getAxiosFetcher = (client: AxiosInstance) => {
  const fetcher = async <T>(url: string) => (await client.get<T>(url)).data;
  return fetcher;
};
