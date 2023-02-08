import { MarketInfo } from "./config";
import { Back, RaceData, Runner } from "./meets";
import { Token } from "./tokens";

export type BetSlipErrorEntry = {
  bet: Omit<BetSlipEntry, "id">;
  errorMessage: string;
};

export type BetSlipEntry = {
  id: number;
  market: MarketInfo;
  back: Back;
  wager: string;
  runner: Runner;
  race: Omit<
    RaceData & {
      raceNumber: string;
    },
    "runners"
  >;
  timestamp: number;
};

export type BetSlipContextType = {
  txLoading: boolean;
  hashes?: string[];
  bets?: BetSlipEntry[];
  error?: string;
  addBet: (bet: Omit<BetSlipEntry, "id">) => void;
  removeBet: (id: number) => void;
  clearBets: () => void;
  placeBets: () => void;
  openModal: () => void;
};

export type TokenContextType = {
  currentToken?: Token;
  availableTokens?: Array<Token>;
  tokensLoading: boolean;
  changeToken: (to: Token) => void;
  openModal: () => void;
};
