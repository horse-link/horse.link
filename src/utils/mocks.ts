import { ethers } from "ethers";
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
