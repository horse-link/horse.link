import axios, { AxiosInstance } from "axios";
import {
  BetHistoryResponse,
  Market,
  SignedMeetingsResponse,
  SignedRunnersResponse
} from "../types/index";

export default class Api {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "https://api.horse.link",
      headers: {
        Accept: "application/json"
      }
    });
  }
  public getMeetings = async (): Promise<SignedMeetingsResponse> => {
    const { data } = await this.client.get<SignedMeetingsResponse>("/meetings");

    return data;
  };

  public getRunners = async (
    track: string,
    number: number
  ): Promise<SignedRunnersResponse> => {
    const { data } = await this.client.get<SignedRunnersResponse>(
      `/runners/${track}/${number}/win`
    );

    return data;
  };

  public getBetHistory = async (): Promise<BetHistoryResponse> => {
    const { data } = await this.client.get("/history");

    return data;
  };

  public getUserBetHistory = async (
    account: string
  ): Promise<BetHistoryResponse> => {
    const { data } = await this.client.get(`/history/${account}`);

    return data;
  };

  public requestTokenFromFaucet = async (
    userAddress: string,
    tokenAddress: string
  ): Promise<{ tx: string }> => {
    const { data } = await this.client.post(`/faucet`, {
      to: userAddress,
      amount: (100 * 10 ** 18).toString(),
      address: tokenAddress
    });

    return data;
  };

  public getTotalLiquidity = async (): Promise<{ assets: number }> => {
    const { data } = await this.client.get("/vaults/liquidity");
    return data;
  };

  public getTotalInPlay = async (): Promise<{ total: number }> => {
    const { data } = await this.client.get("/inplay");
    return data;
  };

  public getTotalPerformance = async (): Promise<{ performance: number }> => {
    const { data } = await this.client.get("/vaults/performance");
    return data;
  };

  public getMarketAddresses = async (): Promise<string[]> => {
    const { data } = await this.client.get("/markets/");
    return data;
  };

  public getMarketDetail = async (marketAddress: string): Promise<Market> => {
    const { data } = await this.client.get(`/markets/${marketAddress}`);
    return data;
  };

  public getMarkets = async (): Promise<{ assets: number }> => {
    const { data } = await this.client.get("/markets/");
    return data;
  };

  public getVaults = async (): Promise<{ assets: number }> => {
    const { data } = await this.client.get("/vaults/");
    return data;
  };
}
