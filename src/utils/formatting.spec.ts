import { formatToFourDecimals } from "./formatting";

test.concurrent.each([
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