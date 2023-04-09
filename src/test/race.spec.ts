import { expect } from "chai";
import { createCellText, createRacingLink } from "../utils/races";
import { Meet, Race } from "../types/meets";
import { RaceStatus } from "../constants/status";
import dayjs from "dayjs";

describe("Race utils tests", () => {
  const now = dayjs("2023-01-01");

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

  it("Should create cell text for normal race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Normal,
      close: "2023-01-01T00:00:00.000Z"
    };

    const result = createCellText(mockRace, now);
    const expected = "CLSD";

    expect(result).to.equal(expected);
  });

  it("Should create cell text for closed race", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Closed
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
      status: RaceStatus.Paying
    };

    const result = createCellText(mockRace, now);
    const expected = "1, 2, 3";

    expect(result).to.equal(expected);
  });
});
