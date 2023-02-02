import dayjs from "dayjs";
import utils from "../utils";

test.concurrent.each([
  ["0", "0.0000"],
  ["1", "1.0000"],
  ["12", "12.0000"],
  ["3456", "3456.0000"],
  ["123456789", "123456789.0000"],
  ["1.1", "1.1000"],
  ["12.12", "12.1200"],
  ["234.234", "234.2340"],
  ["3456.3456", "3456.3456"],
  ["1.00000", "1.0000"]
])("should have trailing zero", async (input, expected) => {
  const result = utils.formatting.formatToFourDecimals(input);
  expect(result).toBe(expected);
});

test.concurrent.each([
  ["0.0000", "0.0000"],
  ["0.00051", "0.0005"],
  ["0.00055", "0.0006"],
  ["0.00056", "0.0006"],
  ["123456789.123456789", "123456789.1235"]
])("round to four decimal", async (input, expected) => {
  const result = utils.formatting.formatToFourDecimals(input);
  expect(result).toBe(expected);
});

test.concurrent.each([
  "0.00001",
  "0.0000198",
  "0.0000100000",
  "0.00005",
  "0.000050341",
  "0.00009",
  "0.000099",
  "0.000005132156"
])("less than 0.0001", async input => {
  const result = utils.formatting.formatToFourDecimals(input);
  expect(result).toBe("<0.0001");
});

test.concurrent.each([
  ["1", "1.00"],
  ["12", "12.00"],
  ["20.01", "20.01"],
  ["100.1045", "100.10"],
  ["1000.2895", "1000.29"]
])("round to two decimals", async (input, expected) => {
  const result = utils.formatting.formatToTwoDecimals(input);
  expect(result).toBe(expected);
});

describe("address tests", () => {
  it("should shorten address", () => {
    const actual = utils.formatting.shortenAddress(
      "0x00000000219ab540356cBB839Cbe05303d7705Fa"
    );
    expect(actual).toEqual("0x000...705Fa");
  });

  it("should shorten hash", () => {
    const actual = utils.formatting.shortenHash(
      "0x28d9cb5e5a5c4c5d27cf9d8b91ca9b34c31452d105a7201ecd327876f816a592"
    );
    expect(actual).toEqual("0x28d9cb5e5a5c4...d327876f816a592");
  });
});

describe("general formatting tests", () => {
  it("should capitalise the first letter", () => {
    const wordOne = "foo";
    const wordTwo = "Bar";
    const wordThree = "FOO";
    const wordFour = "bAR";

    expect(utils.formatting.formatFirstLetterCapitalised(wordOne)).toEqual(
      "Foo"
    );
    expect(utils.formatting.formatFirstLetterCapitalised(wordTwo)).toEqual(
      "Bar"
    );
    expect(utils.formatting.formatFirstLetterCapitalised(wordThree)).toEqual(
      "Foo"
    );
    expect(utils.formatting.formatFirstLetterCapitalised(wordFour)).toEqual(
      "Bar"
    );
  });

  it("should get the time difference formatted (minutes and seconds)", () => {
    const dateOne = dayjs().add(1, "minute");
    const dateOneFormatted = utils.formatting.formatTimeToHMS(
      dateOne.toString()
    );
    // account for second elapsing
    expect(dateOneFormatted).toEqual("0h 0m 59s");

    const dateTwo = dayjs().subtract(1, "minute");
    const dateTwoFormatted = utils.formatting.formatTimeToHMS(
      dateTwo.toString()
    );
    expect(dateTwoFormatted).toEqual("-0h 1m 0s");

    const dateThree = dayjs().add(30, "seconds");
    const dateThreeFormatted = utils.formatting.formatTimeToHMS(
      dateThree.toString()
    );
    // account for second elapsing
    expect(dateThreeFormatted).toEqual("0h 0m 29s");

    const dateFour = dayjs().subtract(30, "seconds");
    const dateFourFormatted = utils.formatting.formatTimeToHMS(
      dateFour.toString()
    );
    expect(dateFourFormatted).toEqual("-0h 0m 30s");

    const dateFive = dayjs().add(1, "minute").add(30, "seconds");
    const dateFiveFormatted = utils.formatting.formatTimeToHMS(
      dateFive.toString()
    );
    // account for second elapsing
    expect(dateFiveFormatted).toEqual("0h 1m 29s");

    const dateSix = dayjs().subtract(1, "minute").subtract(30, "seconds");
    const dateSixFormatted = utils.formatting.formatTimeToHMS(
      dateSix.toString()
    );
    expect(dateSixFormatted).toEqual("-0h 1m 30s");
  });

  it("should get the time difference formatted (hours)", () => {
    const dateOne = dayjs().add(1, "hour").add(1, "second");
    const dateOneFormatted = utils.formatting.formatTimeToHMS(
      dateOne.toString()
    );
    // account for second elapsing
    expect(dateOneFormatted).toEqual("1h 0m 0s");

    const dateTwo = dayjs().subtract(1, "hour");
    const dateTwoFormatted = utils.formatting.formatTimeToHMS(
      dateTwo.toString()
    );
    expect(dateTwoFormatted).toEqual("-1h 0m 0s");

    const dateThree = dayjs()
      .add(1, "hour")
      .add(30, "minutes")
      .add(1, "second");
    const dateThreeFormatted = utils.formatting.formatTimeToHMS(
      dateThree.toString()
    );
    // account for second elapsing
    expect(dateThreeFormatted).toEqual("1h 30m 0s");

    const dateFour = dayjs().subtract(1, "hour").subtract(30, "minutes");
    const dateFourFormatted = utils.formatting.formatTimeToHMS(
      dateFour.toString()
    );
    expect(dateFourFormatted).toEqual("-1h 30m 0s");
  });

  test.concurrent.each([
    [0, "0th"],
    [1, "1st"],
    [2, "2nd"],
    [3, "3rd"],
    [4, "4th"],
    [11, "11th"],
    [21, "21st"],
    [42, "42nd"],
    [103, "103rd"]
  ])("should add ordinal suffix to number", async (input, expected) => {
    const result = utils.formatting.formatOrdinals(input);
    expect(result).toBe(expected);
  });
});
