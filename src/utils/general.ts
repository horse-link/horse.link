import { AxiosInstance } from "axios";
import CryptoJS from "crypto-js";

export const getAxiosFetcher = (client: AxiosInstance) => {
  const fetcher = async <T>(url: string) => (await client.get<T>(url)).data;
  return fetcher;
};

export const encryptString = (message: string, key: string) =>
  CryptoJS.AES.encrypt(message, key).toString();

export const decryptString = (cipher: string, key: string) =>
  CryptoJS.AES.decrypt(cipher, key).toString(CryptoJS.enc.Utf8);
