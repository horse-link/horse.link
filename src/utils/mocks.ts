import { ethers } from "ethers";
import { Bet, FormattedUser } from "../types/entities";
import { Back, Meet, Race } from "../types/meets";

export const getMockBet = (): Bet => ({
  id: `BET_${ethers.constants.AddressZero}_0`,
  propositionId: ethers.constants.AddressZero,
  marketId: ethers.constants.AddressZero,
  marketAddress: ethers.constants.AddressZero,
  assetAddress: ethers.constants.AddressZero,
  amount: "0",
  payout: "0",
  payoutAt: "0",
  owner: ethers.constants.AddressZero,
  settled: false,
  didWin: false,
  createdAt: "0",
  settledAt: "0",
  createdAtTx: ethers.constants.AddressZero,
  settledAtTx: ethers.constants.AddressZero
});

export const getMockUser = (): FormattedUser => ({
  id: ethers.constants.AddressZero,
  totalDeposited: ethers.constants.Zero,
  inPlay: ethers.constants.Zero,
  pnl: ethers.constants.Zero,
  lastUpdate: 0
});

export const getMockBack = (): Back => ({
  nonce: "0",
  proposition_id: "",
  market_id: "",
  odds: 0,
  close: 0,
  end: 0,
  signature: { r: "", s: "", v: 0 }
});

export const getMockRunners = () => Array.from({ length: 5 }, () => undefined);

export const getMockAddresses = () =>
  Array.from({ length: 5 }, () => ethers.constants.AddressZero);

export const getMockRaces = (length?: number): Race[] =>
  Array.from({ length: length ?? 15 }, (_, i) => ({
    number: i,
    name: "",
    status: "Normal",
    results: [9, 1, 2, 7]
  }));

export const getMockMeets = (): Meet[] =>
  Array.from({ length: 5 }, (_, i) => ({
    id: `mock${i}`,
    name: "",
    location: "",
    date: "",
    races: getMockRaces()
  }));

export const getMockVaultTableRows = () =>
  Array.from({ length: 4 }, () => undefined);

export const getMockBetHistory = () =>
  Array.from({ length: 5 }, () => undefined);
