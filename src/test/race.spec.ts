import { expect } from "chai";
import { createRacingLink } from "../utils/races";
import { Meet, Race } from "../types/meets";
import { RaceStatus } from "../constants/status";

describe("Race utils tests", () => {
  it("Should return correct link for race", () => {
    // export type Race = {
    //   number: number;
    //   name: string;
    //   start?: string;
    //   start_unix?: number;
    //   end?: string;
    //   end_unix?: number;
    //   close?: string;
    //   close_unix?: number;
    //   status: RaceStatus;
    //   results?: number[];
    // };

    const mockRace: Race = {
      number: 1,
      name: "Mock Race 1",
      status: RaceStatus.Normal
    };

    // export type Meet = {
    //   id: string;
    //   name: string;
    //   location: string;
    //   date: string;
    //   races: Race[];
    // };

    const mockMeet: Meet = {
      id: "1",
      name: "Mock Meet 1",
      location: "Mock Location 1",
      date: "2023-01-01",
      races: [mockRace]
    };

    const result = createRacingLink(mockRace, mockMeet, true);
    const expected = "";

    expect(result).to.equal(expected);
  });
});
