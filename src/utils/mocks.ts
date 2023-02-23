import { ethers } from "ethers";
import { Bet, FormattedUser } from "../types/subgraph";
import { Back, Meet, Race } from "../types/meets";
import { SignedBetDataResponse } from "../types/bets";

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

export const getRealExampleMockBet = (): Bet => ({
  amount: "2000000000000000000",
  assetAddress: "0xf9f36c66854010d61e8f46f9cc46f9ed55996229",
  createdAt: "1675223604",
  createdAtTx:
    "0xe061e4ed94b01e185f836e579573a6c2161f42f002ab6043f393ec312b1f2e25",
  didWin: false,
  id: "BET_0xb5ee5025c830333faec0c0edc3d1c3be2e85e331_217",
  marketAddress: "0xb5ee5025c830333faec0c0edc3d1c3be2e85e331",
  marketId: "0x30313933383943425930310000000000",
  owner: "0x042bc2d085c0584bd56d62c170c4679e1ee9fc45",
  payout: "16268426000000000000",
  payoutAt: "1675226100",
  propositionId: "0x30313933383943425930315730370000",
  settled: false,
  settledAt: "0",
  settledAtTx: ""
});

export const getMockSignedBetDataResponse = (): SignedBetDataResponse => ({
  marketResultAdded: false,
  scratchedRunners: [
    {
      b16propositionId: "0x30313933383943425930315730370000",
      odds: 1,
      totalOdds: "80040337",
      marketResultAdded: false,
      signature: {
        v: 28,
        r: "0xa49e1e507cbd260d40a5ad0c47dffc3b79ed0acfd316a4ef5dddcbc19a75ea58",
        s: "0x2dc06cfb7786974aa5f9bd73cc4e188776809ade82ea9be103a74fbac8c24d28"
      }
    },
    {
      b16propositionId: "0x30313933383943425930315730370069",
      odds: 1,
      totalOdds: "80040369",
      marketResultAdded: true
    }
  ]
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

export const getMockLeaderboardStats = () =>
  Array.from({ length: 10 }, () => undefined);
