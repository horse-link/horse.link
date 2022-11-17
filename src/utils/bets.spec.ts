import { calculateBetTableMaxPages } from "./bets";

test.concurrent.each([
  [5, 1],
  [10, 1],
  [15, 2],
  [25, 3]
])("should return enough pages to show all data (10)", async (input, expected) => {
  const pages = calculateBetTableMaxPages(input, 10);
  expect(pages).toBe(expected);
});

test.concurrent.each([
  [5, 1],
  [10, 1],
  [30, 2],
  [50, 2]
])("should return enough pages to show all data (25)", async (input, expected) => {
  const pages = calculateBetTableMaxPages(input, 25);
  expect(pages).toBe(expected);
});

test.concurrent.each([
  [10, 1],
  [30, 1],
  [55, 2],
  [1000, 20]
])("should return enough pages to show all data (50)", async (input, expected) => {
  const pages = calculateBetTableMaxPages(input, 50);
  expect(pages).toBe(expected);
});