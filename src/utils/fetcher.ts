import client from "./client";

const fetcher = async <T>(url: string) => (await client.get<T>(url)).data;

export default fetcher;
