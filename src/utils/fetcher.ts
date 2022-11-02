import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://api.horse.link",
  headers: {
    Accept: "application/json"
  }
});

async function fetcher<T>(url: string) {
  return (await client.get<T>(url)).data;
}

export default fetcher;
