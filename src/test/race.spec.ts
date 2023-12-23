import { expect } from "chai";
import {
  createCellText,
  createRacingLink,
  isScratchedRunner
} from "../utils/races";
import { Meet, RaceStatus, Race, Runner, RaceWithResults } from "horselink-sdk";
import dayjs from "dayjs";

describe("Race utils tests", () => {
  const now = dayjs("2023-01-01 10:00:00");

  it("Should return true for scratched runner", () => {
    const mockRunner: Runner = {
      name: "Mock Runner 1",
      number: 1,
      nonce: "1",
      market_id: "1",
      close: 0,
      end: 0,
      win: 0,
      place: 0,
      handicapWeight: 0,
      last5Starts: "x1111",
      proposition_id: "1",
      barrier: 1,
      rider: "Mock Rider 1",
      signature: {
        r: "1",
        s: "1",
        v: 1
      },
      win_signature: {
        r: "1",
        s: "1",
        v: 1
      },
      place_signature: {
        r: "1",
        s: "1",
        v: 1
      },
      status: "Scratched",
      percentage: 0,
      backed: 0
    };

    const result = isScratchedRunner(mockRunner);
    const expected = true;

    expect(result).to.equal(expected);
  });

  it("Should create a link for normal race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.NORMAL,
      start: "2023-01-01 10:55:00",
      close: "2023-01-01 10:50:00",
      distance: 1000,
      hasOdds: true
    };

    const mockMeet: Meet = {
      id: "1",
      name: "Mock Meet 1",
      location: "Mock Location 1",
      date: "2023-01-01",
      races: [mockRace]
    };

    const result = createRacingLink(mockRace, mockMeet);
    const expected = "/races/1/2";

    expect(result).to.equal(expected);
  });

  it("Should still create a link for closed race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.CLOSED,
      start: "2023-01-01 10:55:00",
      close: "2023-01-01 10:50:00",
      distance: 1000,
      hasOdds: true
    };

    const mockMeet: Meet = {
      id: "1",
      name: "Mock Meet 1",
      location: "Mock Location 1",
      date: "2023-01-01",
      races: [mockRace]
    };

    const result = createRacingLink(mockRace, mockMeet);
    const expected = "/races/1/2";

    expect(result).to.equal(expected);
  });

  it("Should create a link for paying race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.PAYING,
      start: "2023-01-01 10:55:00",
      close: "2023-01-01 10:50:00",
      distance: 1000,
      hasOdds: true
    };

    const mockMeet: Meet = {
      id: "1",
      name: "Mock Meet 1",
      location: "Mock Location 1",
      date: "2023-01-01",
      races: [mockRace]
    };

    const result = createRacingLink(mockRace, mockMeet);
    const expected = "/results/2023-01-01_1_2_W1";

    expect(result).to.equal(expected);
  });

  it("Should create cell text with mins for normal race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.NORMAL,
      start: "2023-01-01 10:55:00",
      close: "2023-01-01 10:50:00",
      distance: 1000,
      hasOdds: true
    };

    const result = createCellText(mockRace, now);
    const expected = "55m";

    expect(result).to.equal(expected);
  });

  it("Should create cell text for closed race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.CLOSED,
      close: "2023-01-01 09:55:00",
      distance: 1000,
      hasOdds: true
    };

    const result = createCellText(mockRace, now);
    const expected = "CLSD";

    expect(result).to.equal(expected);
  });

  it("Should create cell text for abandoned race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.ABANDONED,
      close: "2023-01-01 09:55:00",
      distance: 1000,
      hasOdds: true
    };

    const result = createCellText(mockRace, now);
    const expected = "ABND";

    expect(result).to.equal(expected);
  });

  it("Should create cell text for paying race", () => {
    const mockRace: RaceWithResults = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.PAYING,
      close: "2023-01-01 09:55:00",
      distance: 1000,
      hasOdds: true,
      results: [1, 2, 3]
    };

    const result = createCellText(mockRace, now);
    const expected = "1,2,3";

    expect(result).to.equal(expected);
  });
});
