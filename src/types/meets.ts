import dayjs from "dayjs";
import { RaceStatus } from "../constants/status";
import { EcSignature, SignedResponse } from "./general";
import { RunnerStatus } from "horselink-sdk";

// Move to SDK
export type Runner = {
  number: number;
  name: string;
  nonce: string;
  market_id: string;
  close: number;
  end: number;
  odds: number;
  win: number;
  place: number;
  handicapWeight: number;
  last5Starts: string;
  proposition_id: string;
  barrier: number;
  signature: EcSignature;
  win_signature: EcSignature;
  place_signature: EcSignature;
  status: RunnerStatus;
  backed: number;
  percentage: number;
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
  status: RaceStatus;
  results?: number[];
};

export type RaceData = {
  raceData: {
    name: string;
    distance: number;
    class: string;
    hasOdds: boolean;
    start: dayjs.Dayjs;
    close: number;
    end: number;
  };
  track: {
    name: string;
    code: string;
  };
  runners: Runner[];
};

export type SignedRunnersResponse = {
  data: {
    raceData: {
      name: string;
      distance: number;
      class: string;
      hasOdds: boolean;
      start: dayjs.Dayjs;
      close: number;
      end: number;
    };
    track: {
      name: string;
      code: string;
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

export type MeetInfo = {
  meetingName: string;
  location: string;
  raceType: string;
  meetingDate: string;
  prizeMoney: string;
  weatherCondition: string | null;
  trackCondition: string | null;
  railPosition: string | null;
  venueMnemonic: string;
  raceInfo: RaceInfo[];
};

export type RaceInfo = {
  raceNumber: number;
  raceName: string;
  raceClassConditions: string;
  raceDistance: number;
  raceStartTime: string;
  raceStatus: RaceStatus;
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

// The parameters for a call to back() on the Market contract.
// Same as Back but with a wager attribute
export type BackParams = Back & {
  wager: string;
};

export type WinningHorse = {
  runner: string;
  number: number;
  rider: string;
  place: number;
};

export type MeetResults = {
  track: {
    name: string;
    code: string;
  };
  winningHorses: WinningHorse[];
};

export type MeetFilters = "ALL" | "AUS_NZ" | "INTERNATIONAL";
