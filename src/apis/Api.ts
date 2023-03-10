import { AxiosInstance, AxiosRequestConfig } from "axios";
import { ethers } from "ethers";
import utils from "../utils";
import { Config } from "../types/config";
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

export class Api {
  private client: AxiosInstance;
  private chainName: string;

  constructor(defaultChainName: string) {
    this.client = utils.general.getAxiosClient();
    this.chainName = defaultChainName;
  }

  public setChainName(chainName: string) {
    this.chainName = chainName;
  }

  private headers() {
    return {
      "chain-id": this.chainName
    };
  }

  private requestConfig() {
    return {
      headers: this.headers()
    };
  }

  private get<T>(url: string, config?: AxiosRequestConfig) {
    const defaultConfig = this.requestConfig();
    const combinedConfig = { ...defaultConfig, ...config };
    return this.client.get<T>(url, combinedConfig);
  }

  private post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const defaultConfig = this.requestConfig();
    const combinedConfig = { ...defaultConfig, ...config };
    return this.client.post<T>(url, data, combinedConfig);
  }

  public getConfig = async (): Promise<Config> => {
    const { data } = await this.get<Config>("/config");

    return data;
  };

  public getMeetings = async (): Promise<SignedMeetingsResponse> => {
    const { data } = await this.get<SignedMeetingsResponse>("/meetings");

    return data;
  };

  // Get all the races for a given meeting
  public getMeeting = async (locationCode: string): Promise<MeetInfo> => {
    const { data } = await this.get<MeetInfo>(`/meetings/${locationCode}`);

    return data;
  };

  public getRaceResult = async (
    propositionId: string
  ): Promise<MeetResults> => {
    const { data } = await this.get<MeetResults>(
      `/meetings/results/${propositionId}`
    );
    return data;
  };

  public getMelbourneCupRunners = async () => {
    const { data } = await this.get<Runner[]>("/melbournecup");
    return data;
  };

  public getBetHistory = async (): Promise<BetHistoryResponse> => {
    const { data } = await this.get<BetHistoryResponse>("/bets");

    return data;
  };

  public getWinningResultSignature = async (
    marketId: string,
    sign: boolean = false
  ): Promise<SignedBetDataResponse> => {
    const { data } = await this.get<SignedBetDataResponse>(
      `/bets/${marketId}?sign=${sign}`
    );

    return data;
  };

  public getUserBetHistory = async (
    account: string
  ): Promise<BetHistoryResponse> => {
    const { data } = await this.get<BetHistoryResponse>(`/bets/${account}`);

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

    const { data } = await this.post<{ tx: string }>(`/faucet`, {
      to: userAddress,
      amount: amount.toString(),
      address: tokenAddress
    });

    return data;
  };

  public getTotalLiquidity = async (): Promise<{ assets: number }> => {
    const { data } = await this.get<{ assets: number }>("/vaults/liquidity");
    return data;
  };

  public getTotalInPlay = async (): Promise<{ total: number }> => {
    const { data } = await this.get<{ total: number }>("/inplay");
    return data;
  };

  public getTotalPerformance = async (): Promise<{ performance: number }> => {
    const { data } = await this.get<{ performance: number }>(
      "/vaults/performance"
    );
    return data;
  };

  public getMarketAddresses = async (): Promise<string[]> => {
    const { data } = await this.get<string[]>("/markets/");
    return data;
  };

  public getMarketDetail = async (marketAddress: string): Promise<Market> => {
    const { data } = await this.get<Market>(`/markets/${marketAddress}`);
    return data;
  };

  public getVaultAddresses = async (): Promise<string[]> => {
    const { data } = await this.get<string[]>("/vaults/");
    return data;
  };

  public getVaultDetail = async (vaultAddress: string): Promise<Vault> => {
    const { data } = await this.get<Vault>(`/vaults/${vaultAddress}`);
    return data;
  };

  public getVaultToken = async (vaultAddress: string): Promise<Token> => {
    const { data } = await this.get<Token>(`/vaults/${vaultAddress}/token`);
    return data;
  };

  public getVaultUserData = async (
    vaultAddress: string,
    userAddress: string
  ): Promise<VaultUserData> => {
    const { data } = await this.get<VaultUserData>(
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
    const { data } = await this.get<{ allowance: string }>("/allowance/", {
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
    const { data } = await this.get<{ potentialPayout: string }>("/payout/", {
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

/*const api = (chainName: string) {
  new Api(chainName);
}*/
let chainId = window.location.hostname.split(".")[0];
if (chainId === "localhost") {
  chainId = "sepolia";
}

console.log("Using chain: ", chainId);
const api = new Api(chainId);

export default api;
