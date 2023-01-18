import utils from "../utils";
import { expect } from "chai";

describe("Calculation tests", () => {
  it("Should correctly calculate odds margin", () => {
    const oddsArray = [2.3];
    const margin = utils.races.calculateRaceMargin(oddsArray);

    // using nine units of precision as displayed by ticket
    expect((+margin).toFixed(9)).to.equal("0.434782609");

    // same units as on ticket
    const biggerOddsArray = [2.3, 3.7, 6.5, 10, 6.5, 26, 15, 19, 81, 71];
    const biggerMargin = utils.races.calculateRaceMargin(biggerOddsArray);

    expect((+biggerMargin).toFixed(9)).to.equal("1.296935157");
  });
});
