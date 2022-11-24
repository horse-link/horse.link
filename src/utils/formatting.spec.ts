import {
  formatToFourDecimals,
  formatToTwoDecimals,
  shortenAddress,
  shortenHash
} from "./formatting";

import { describe, test, expect, it } from "vitest";

test.concurrent.each([
  ["0", "0"],
  ["1", "1"],
  ["12", "12"],
  ["3456", "3456"],
  ["123456789", "123456789"],
  ["1.1", "1.1"],
  ["12.12", "12.12"],
  ["234.234", "234.234"],
  ["3456.3456", "3456.3456"],
  ["1.00000", "1"]
])("should not have trailing zero", async (input, expected) => {
  const result = formatToFourDecimals(input);
  expect(result).toBe(expected);
});

test.concurrent.each([
  ["0.0000", "0"],
  ["0.00051", "0.0005"],
  ["0.00055", "0.0006"],
  ["0.00056", "0.0006"],
  ["123456789.123456789", "123456789.1235"]
])("round to four decimal", async (input, expected) => {
  const result = formatToFourDecimals(input);
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
  const result = formatToFourDecimals(input);
  expect(result).toBe("<0.0001");
});

test.concurrent.each([
  ["1", "1.00"],
  ["12", "12.00"],
  ["20.01", "20.01"],
  ["100.1045", "100.10"],
  ["1000.2895", "1000.29"]
])("round to two decimals", async (input, expected) => {
  const result = formatToTwoDecimals(input);
  expect(result).toBe(expected);
});

describe("address tests", () => {
  it("should shorten address", () => {
    const actual = shortenAddress("0x00000000219ab540356cBB839Cbe05303d7705Fa");
    expect(actual).toEqual("0x000...705Fa");
  });

  it("should shorten hash", () => {
    const actual = shortenHash(
      "0x28d9cb5e5a5c4c5d27cf9d8b91ca9b34c31452d105a7201ecd327876f816a592"
    );
    expect(actual).toEqual("0x28d9cb5e5a5c4...d327876f816a592");
  });
});
