import client from "./client";

const fetcher = async <T>(url: string) => {
  return (await client.get<T>(url)).data;
};

export default fetcher;
