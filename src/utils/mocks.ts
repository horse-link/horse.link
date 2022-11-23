import { ethers } from "ethers";
import { Back } from "../types";
import { Bet, FormattedUser } from "../types/entities";

export const getMockBet = (): Bet => ({
  id: `BET_${ethers.constants.AddressZero}_0`,
  propositionId: ethers.constants.AddressZero,
  marketId: ethers.constants.AddressZero,
  marketAddress: ethers.constants.AddressZero,
  assetAddress: ethers.constants.AddressZero,
  amount: "0",
  payout: "0",
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