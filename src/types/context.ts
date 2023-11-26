import { MarketInfo } from "./config";
import { Back } from "./meets";
import { Token } from "./tokens";
import { Api } from "../apis/Api";
import { Network } from "./general";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Signer } from "ethers";
import { Runner } from "horselink-sdk";

export type BetSlipErrorEntry = {
  bet: Omit<BetSlipEntry, "id">;
  errorMessage: string;
};

export type BetEntry = Omit<BetSlipEntry, "id">;

export type BetSlipEntry = {
  id: number;
  market: MarketInfo;
  back: Back;
  wager: string;
  runner: Runner;
  name: string; // name
  number: number; // number
  // race: Omit<
  //   RaceData & {
  //     raceNumber: string;
  //   },
  //   "runners"
  // >;
  timestamp: number;
};

export type BetSlipContextType = {
  txLoading: boolean;
  hashes?: string[];
  bets?: BetSlipEntry[];
  errors?: string[];
  addBet: (bet: BetEntry) => void;
  removeBet: (id: number) => void;
  clearBets: () => void;
  placeBetsInBetSlip: () => void;
  placeBetImmediately: (bet: BetEntry) => Promise<void>;
  forceNewSigner: (signer: Signer) => void;
};

export type TokenContextType = {
  currentToken?: Token;
  availableTokens?: Array<Token>;
  tokensLoading: boolean;
  changeToken: (to: Token) => void;
  openModal: () => void;
};

export type ApiContextType = {
  api: Api;
  chain?: Network;
  forceNewChain: (newChain: Network) => void;
};

export type ApolloContextType = {
  client: ApolloClient<NormalizedCacheObject>;
  chain?: Network;
  forceNewChain: (newChain: Network) => void;
};
