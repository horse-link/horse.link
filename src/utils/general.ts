import axios, { AxiosInstance } from "axios";

export const getAxiosClient = () =>
  axios.create({
    baseURL: process.env.VITE_API_URL,
    headers: {
      Accept: "application/json"
    }
  });

export const getAxiosFetcher = (client: AxiosInstance) => {
  const fetcher = async <T>(url: string) => (await client.get<T>(url)).data;
  return fetcher;
};
