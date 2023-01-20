import { expect } from "chai";
import utils from "../utils";

describe("Market id tests", () => {
  it("Should return correctly formatted Market id", () => {
    const result = utils.id.getMarketDetailsFromId("019366DBO01");
    const expected = {
      date: "09-01-2023",
      location: "DBO",
      raceNumber: "01"
    };
    expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));

    const resultTwo = utils.id.getMarketDetailsFromId("029366DBO02");
    const expectedTwo = {
      date: "09-01-2023",
      location: "DBO",
      raceNumber: "01"
    };
    expect(JSON.stringify(resultTwo)).to.not.equal(JSON.stringify(expectedTwo));
  });
});
