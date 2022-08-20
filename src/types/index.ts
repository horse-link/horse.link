export type SignedResponse = {
  owner: string;
  data: MeetResponse;
  signature: string;
  hash: string;
};

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
}
