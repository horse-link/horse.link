import { expect } from "chai";
import {
  createCellText,
  createRacingLink,
  isScratchedRunner
} from "../utils/races";
import { Meet, Race, Runner } from "../types/meets";
import { RaceStatus } from "../constants/status";
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
      odds: 0,
      handicapWeight: 0,
      last5Starts: "x1111",
      proposition_id: "1",
      barrier: 1,
      signature: {
        r: "1",
        s: "1",
        v: 1
      },
      status: "Scratched"
    };

    const result = isScratchedRunner(mockRunner);
    const expected = true;

    expect(result).to.equal(expected);
  });

  it("Should create a link for normal race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Normal
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
      status: RaceStatus.Closed
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

  it("Should still create a link for paying race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Paying
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
      status: RaceStatus.Normal,
      start: "2023-01-01 10:55:00",
      close: "2023-01-01 10:50:00"
    };

    const result = createCellText(mockRace, now);
    const expected = "55m";

    expect(result).to.equal(expected);
  });

  it("Should create cell text for closed race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Closed,
      close: "2023-01-01 09:55:00"
    };

    const result = createCellText(mockRace, now);
    const expected = "CLSD";

    expect(result).to.equal(expected);
  });

  it("Should create cell text for abandoned race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Abandoned
    };

    const result = createCellText(mockRace, now);
    const expected = "ABND";

    expect(result).to.equal(expected);
  });

  it("Should create cell text for paying race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Paying,
      results: [1, 2, 3]
    };

    const result = createCellText(mockRace, now);
    const expected = "1 2 3";

    expect(result).to.equal(expected);
  });
});
