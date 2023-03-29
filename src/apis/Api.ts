import axios, { AxiosInstance } from "axios";
import { ethers } from "ethers";
import utils from "../utils";
import { Config, VaultInfo } from "../types/config";
import {
  MeetInfo,
  MeetResults,
  Runner,
  SignedMeetingsResponse
} from "../types/meets";
import { BetHistoryResponse, SignedBetDataResponse } from "../types/bets";
import { Market, Vault } from "../typechain";
import { Token } from "graphql";
import { VaultUserData } from "../types/vaults";
import { Network } from "../types/general";
import constants from "../constants";

export class Api {
  public client: AxiosInstance;

  constructor(network: Network) {
    this.client = this.createAxiosClient(network);
  }

  private createAxiosClient = (network: Network) =>
    axios.create({
      baseURL: constants.env.API_URL,
      headers: {
        Accept: "application/json",
        "chain-id": network.id
      }
    });

  public getConfig = async (): Promise<Config> => {
    const { data } = await this.client.get<Config>("/config");

    return data;
  };

  public getMeetings = async (): Promise<SignedMeetingsResponse> => {
    const { data } = await this.client.get<SignedMeetingsResponse>("/meetings");

    return data;
  };

  // Get all the races for a given meeting
  public getMeeting = async (locationCode: string): Promise<MeetInfo> => {
    const { data } = await this.client.get<MeetInfo>(
      `/meetings/${locationCode}`
    );

    return data;
  };

  public getRaceResult = async (
    propositionId: string
  ): Promise<MeetResults> => {
    const { data } = await this.client.get<MeetResults>(
      `/meetings/results/${propositionId}`
    );
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

  public getWinningResultSignature = async (
    marketId: string,
    sign: boolean = false
  ): Promise<SignedBetDataResponse> => {
    const { data } = await this.client.get(`/bets/${marketId}?sign=${sign}`);

    return data;
  };

  public getUserBetHistory = async (
    account: string
  ): Promise<BetHistoryResponse> => {
    const { data } = await this.client.get(`/bets/${account}`);

    return data;
  };

  public requestTokenFromFaucet = async (
    userAddress: string,
    tokenAddress: string
  ): Promise<{ tx: string }> => {
    const config = await this.getConfig();
    const amount = utils.config.isUsdt(tokenAddress, config)
      ? ethers.utils.parseUnits("100", 6)
      : ethers.utils.parseUnits("100");

    const { data } = await this.client.post(`/faucet`, {
      to: userAddress,
      amount: amount.toString(),
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

  public getVaultDetail = async (vaultAddress: string): Promise<VaultInfo> => {
    const { data } = await this.client.get(`/vaults/${vaultAddress}`);
    data.address = vaultAddress;
    return data as VaultInfo;
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
