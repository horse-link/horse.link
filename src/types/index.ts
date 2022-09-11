export type Back = {
  number: number;
  name: string;
  nonce: string;
  market_id: string;
  close: number;
  end: number;
  odds: number;
  proposition_id: string;
  signature: string;
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
  start: Date;
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
  barrier: number;
  signature: Signature;
};

export type Signature = {
  message: string;
  messageHash: string;
  signature: string;
}