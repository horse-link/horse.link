import utils from "../utils";
import { expect } from "chai";

describe("Calculation tests", () => {
  it("Should correctly calculate odds margin", () => {
    // using nine units of precision as displayed by ticket
    const PRECISION = 9;

    const oddsArray = [2.3];
    const margin = utils.races.calculateRaceMargin(oddsArray);

    expect((+margin).toFixed(PRECISION)).to.equal("0.434782609");

    // same units as on ticket
    const biggerOddsArray = [2.3, 3.7, 6.5, 10, 6.5, 26, 15, 19, 81, 71];
    const biggerMargin = utils.races.calculateRaceMargin(biggerOddsArray);

    expect((+biggerMargin).toFixed(PRECISION)).to.equal("1.296935157");

    // division by zero test
    const zero = [0];
    const zeroMargin = utils.races.calculateRaceMargin(zero);

    expect(+zeroMargin).to.equal(1);

    // display test
    const display = utils.formatting.formatToTwoDecimals(
      (+biggerMargin * 100).toString()
    );
    expect(display).to.equal("129.69");
  });
});
