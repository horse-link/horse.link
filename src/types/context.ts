import { BigNumber } from "ethers";
import { MarketInfo } from "./config";
import { Back, Runner } from "./meets";

export type BetSlipEntry = {
  id: number;
  market: MarketInfo;
  back: Back;
  wager: BigNumber;
  runner: Runner;
  timestamp: number;
};

export type BetSlipContextType = {
  txLoading: boolean;
  hashes?: string[];
  bets?: BetSlipEntry[];
  addBet: (bet: Omit<BetSlipEntry, "id">) => void;
  removeBet: (id: number) => void;
  clearBets: () => void;
  placeBets: () => void;
  openModal: () => void;
};
