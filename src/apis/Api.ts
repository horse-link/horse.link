import axios, { AxiosInstance } from "axios";
import {
  BetHistoryResponse,
  SignedMeetingsResponse,
  SignedRunnersResponse
} from "../types/index";

export default class Api {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "https://api.horse.link"
    });
  }
  public getMeetings = async (): Promise<SignedMeetingsResponse> => {
    const { data } = await this.client.get<SignedMeetingsResponse>(
      "/meetings",
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    return data;
  };

  public getRunners = async (
    track: string,
    number: number
  ): Promise<SignedRunnersResponse> => {
    const { data } = await this.client.get<SignedRunnersResponse>(
      `/runners/${track}/${number}/win`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    return data;
  };

  public getBetHistory = async (): Promise<BetHistoryResponse> => {
    const { data } = await this.client.get("/history", {
      headers: {
        Accept: "application/json"
      }
    });

    return data;
  };
}
