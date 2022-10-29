export type VaultUserData = {
  vaultBalance: string;
  userBalance: string;
  performance: string;
  asset: string;
};

export type Token = {
  address: string;
  symbol: string;
  decimals: string;
};

export type Vault = {
  name: string;
  symbol: string;
  totalAssets: string;
  address: string;
};

export type Market = {
  address: string;
  vaultAddress: string;
  name: string;
  target: number;
  totalInPlay: string;
};

export type Back = {
  nonce: string;
  market_id: string;
  close: number;
  end: number;
  odds: number;
  proposition_id: string;
  signature: string;
};

export type BetHistory = {
  index: number;
  market_id: string;
  proposition_id: string;
  punter: string;
  amount: string;
  tx: string;
  blockNumber: number;
  signature: string;
};

export type BetHistoryResponse = {
  results: BetHistory[];
};

export type SignedResponse = {
  owner: string;
  signature: string;
  // hash: string;
};

export type SignedRunnersResponse = {
  data: Runner[];
} & SignedResponse;

export type SignedMeetingsResponse = {
  data: MeetResponse;
} & SignedResponse;

export type MeetResponse = {
  nonce: string;
  created: number;
  expires: number;
  meetings: Meet[];
};

export type Meet = {
  id: string;
  name: string;
  location: string;
  races: Race[];
};

export type Race = {
  number: number;
  name: string;
  start?: Date;
};

export type Runner = {
  number: number;
  name: string;
  nonce: string;
  market_id: string;
  close: number;
  end: number;
  odds: number;
  proposition_id: string;
  proposition_id_hash: string;
  barrier: number;
  signature: Signature;
};

export type Signature = {
  message: string;
  messageHash: string;
  signature: string;
};
