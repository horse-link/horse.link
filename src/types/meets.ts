import { EcSignature, SignedResponse } from "./general";

export type Runner = {
  number: number;
  name: string;
  nonce: string;
  market_id: string;
  close: number;
  end: number;
  odds: number;
  handicapWeight: number;
  last5Starts: string;
  proposition_id: string;
  proposition_id_hash: string;
  barrier: number;
  signature: EcSignature;
};

export type NextToJump = {
  jumperRaceStartTime: string;
  jumperRaceNumber: number;
  meeting: {
    jumperMeetingName: string;
    location: string;
    raceType: string;
  };
};

export type Race = {
  number: number;
  name: string;
  start?: string;
  start_unix?: number;
  end?: string;
  end_unix?: number;
  close?: string;
  close_unix?: number;
  status: "Abandoned" | "Interim" | "Normal" | "Paying" | "Closed";
  results?: number[];
};

export type SignedRunnersResponse = {
  data: {
    raceData: {
      name: string;
      distance: number;
      class: string;
    };
    runners: Runner[];
  };
} & SignedResponse;

export type SignedMeetingsResponse = {
  data: MeetResponse;
} & SignedResponse;

export type Meet = {
  id: string;
  name: string;
  location: string;
  date: string;
  races: Race[];
};

export type MeetResponse = {
  nonce: string;
  created: number;
  expires: number;
  meetings: Meet[];
};

export type Back = {
  nonce: string;
  market_id: string;
  close: number;
  end: number;
  odds: number;
  proposition_id: string;
  signature: EcSignature;
};

export type MeetResults = {
  runner: string;
  number: number;
  rider: string;
  place: number;
}[];

export type MeetFilters = "ALL" | "AUS_NZ" | "INTERNATIONAL";
