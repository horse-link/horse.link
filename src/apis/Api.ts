import axios, { AxiosInstance } from "axios";
import { BigNumberish, ethers } from "ethers";
import { Config } from "../types/config";
import {
  BetHistoryResponse,
  EcSignature,
  Market,
  Runner,
  SignedBetDataResponse,
  SignedMeetingsResponse,
  Token,
  Vault,
  VaultUserData
} from "../types/index";
import { isUsdt } from "../utils/config";

export class Api {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "https://api.horse.link",
      headers: {
        Accept: "application/json"
      }
    });
  }

  public getConfig = async (): Promise<Config> => {
    const { data } = await this.client.get<Config>("/config");

    return data;
  };

  public getMeetings = async (): Promise<SignedMeetingsResponse> => {
    const { data } = await this.client.get<SignedMeetingsResponse>("/meetings");

    return data;
  };

  public getMelbourneCupRunners = async () => {
    const { data } = await this.client.get<Runner[]>("/melbournecup");
    return data;
  };

  public getBetHistory = async (): Promise<BetHistoryResponse> => {
    const { data } = await this.client.get("/bets");

    return data;
  };

  public requestSignedBetData = async (
    marketId: string,
    propositionId: string
  ): Promise<SignedBetDataResponse> => {
    const { data } = await this.client.post("/bets/sign", {
      marketId,
      propositionId
    });

    return data;
  };

  public getUserBetHistory = async (
    account: string
  ): Promise<BetHistoryResponse> => {
    const { data } = await this.client.get(`/bets/${account}`);

    return data;
  };

  public requestBackingSign = async (
    nonce: string,
    propositionId: string,
    marketId: string,
    wager: BigNumberish,
    odds: BigNumberish,
    close: BigNumberish,
    end: BigNumberish
  ): Promise<{ signature: EcSignature }> => {
    const { data } = await this.client.post(`/backing-sign`, {
      nonce,
      propositionId,
      marketId,
      wager,
      odds,
      close,
      end
    });

    return data;
  };

  public requestTokenFromFaucet = async (
    userAddress: string,
    tokenAddress: string
  ): Promise<{ tx: string }> => {
    const config = await this.getConfig();
    const { data } = await this.client.post(`/faucet`, {
      to: userAddress,
      amount: isUsdt(tokenAddress, config)
        ? ethers.utils.parseUnits("100", 6)
        : ethers.utils.parseUnits("100"),
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

  public getVaultAddresses = async (): Promise<string[]> => {
    const { data } = await this.client.get("/vaults/");
    return data;
  };

  public getVaultDetail = async (vaultAddress: string): Promise<Vault> => {
    const { data } = await this.client.get(`/vaults/${vaultAddress}`);
    return data;
  };

  public getVaultToken = async (vaultAddress: string): Promise<Token> => {
    const { data } = await this.client.get(`/vaults/${vaultAddress}/token`);
    return data;
  };

  public getVaultUserData = async (
    vaultAddress: string,
    userAddress: string
  ): Promise<VaultUserData> => {
    const { data } = await this.client.get(
      `/vaults/${vaultAddress}/user/${userAddress}`
    );
    return data;
  };

  public getAllowance = async (
    address: string,
    owner: string,
    spender: string,
    decimals: string
  ): Promise<{
    allowance: string;
  }> => {
    const { data } = await this.client.get("/allowance/", {
      params: {
        address,
        owner,
        spender,
        decimals
      }
    });
    return data;
  };

  public getPotentialPayout = async (
    marketAddress: string,
    propositionId: string,
    wager: number,
    odds: number,
    tokenDecimal: string
  ): Promise<{
    potentialPayout: string;
  }> => {
    const { data } = await this.client.get("/payout/", {
      params: {
        marketAddress,
        propositionId,
        wager,
        odds,
        tokenDecimal
      }
    });
    return data;
  };
}

const api = new Api();

export default api;
