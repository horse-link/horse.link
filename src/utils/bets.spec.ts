import {
  calculateBetTableMaxPages,
  incrementPage,
  decrementPage
} from "./bets";

// calculate pages tests
test.concurrent.each([
  [5, 1],
  [10, 1],
  [15, 2],
  [25, 3]
])(
  "should return enough pages to show all data (10)",
  async (input, expected) => {
    const pages = calculateBetTableMaxPages(input, 10);
    expect(pages).toBe(expected);
  }
);

test.concurrent.each([
  [5, 1],
  [10, 1],
  [30, 2],
  [50, 2]
])(
  "should return enough pages to show all data (25)",
  async (input, expected) => {
    const pages = calculateBetTableMaxPages(input, 25);
    expect(pages).toBe(expected);
  }
);

test.concurrent.each([
  [10, 1],
  [30, 1],
  [55, 2],
  [1000, 20]
])(
  "should return enough pages to show all data (50)",
  async (input, expected) => {
    const pages = calculateBetTableMaxPages(input, 50);
    expect(pages).toBe(expected);
  }
);

// increment and decrement page tests
test.concurrent.each([
  [1, 1, 1],
  [2, 1, 1],
  [2, 3, 3],
  [10, 9, 9],
  [4, 6, 5]
])(
  "should increment page number or wrap to 1",
  async (page, maxPages, expected) => {
    const newPage = incrementPage(page, maxPages);
    expect(newPage).toBe(expected);
  }
);

test.concurrent.each([
  [1, 1, 1],
  [1, 2, 2],
  [2, 3, 1],
  [10, 9, 9],
  [4, 1, 1]
])(
  "should decrement page number or wrap to max pages",
  async (page, maxPages, expected) => {
    const newPage = decrementPage(page, maxPages);
    expect(newPage).toBe(expected);
  }
);
