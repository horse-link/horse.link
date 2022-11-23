import axios from "axios";

const client = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    Accept: "application/json"
  }
});

export default client;
