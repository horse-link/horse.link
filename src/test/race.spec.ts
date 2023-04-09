import { expect } from "chai";
import { createCellText, createRacingLink } from "../utils/races";
import { Meet, Race } from "../types/meets";
import { RaceStatus } from "../constants/status";

describe("Race utils tests", () => {
  it("Should create a link before closing time", () => {
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

    const result = createRacingLink(mockRace, mockMeet, false);
    const expected = "/races/1/2";

    expect(result).to.equal(expected);
  });

  it("Should create closed text", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Normal
    };

    const result = createCellText(mockRace, true);
    const expected = "CLSD";

    expect(result).to.equal(expected);
  });

  it("Should create abandoned text", () => {
    const mockRace: Race = {
      number: 2,
      name: "Mock Race 2",
      status: RaceStatus.Abandoned
    };

    const result = createCellText(mockRace, true);
    const expected = "ABND";

    expect(result).to.equal(expected);
  });
});
