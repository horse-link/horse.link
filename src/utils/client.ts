import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://api.horse.link",
  headers: {
    Accept: "application/json"
  }
});

export default client;
