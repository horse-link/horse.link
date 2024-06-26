import utils from "../utils";

// calculate pages tests
test.concurrent.each([
  [1, 1, 1],
  [5, 8, 2],
  [5, 1, 1],
  [5, 10, 2],
  [15, 30, 2],
  [12, 30, 3]
])(
  "should return enough pages to show all data",
  async (betsArrayLength, totalBets, expected) => {
    const pages = utils.bets.calculateMaxPages(betsArrayLength, totalBets);
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
    const newPage = utils.bets.incrementPage(page, maxPages);
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
    const newPage = utils.bets.decrementPage(page, maxPages);
    expect(newPage).toBe(expected);
  }
);

// detect scratched runners
describe("detect scratched runners", () => {
  it("should return the correct BetHistory for a scratched runner", () => {
    const mockBet = utils.mocks.getRealExampleMockBet();
    const mockSignedBetData = utils.mocks.getMockSignedBetDataResponse();

    const betHistory = utils.bets.getBetHistory(mockBet, mockSignedBetData);

    expect(mockSignedBetData?.scratchedRunners?.length).toBeGreaterThan(0);
    expect(betHistory.propositionId).toEqual(
      mockSignedBetData!.scratchedRunners![0].b16propositionId.toUpperCase()
    );
    expect(betHistory.propositionId).toEqual(
      mockBet.propositionId.toUpperCase()
    );
    expect(!!betHistory.scratched).toEqual(true);
    expect(betHistory.status).toEqual("SCRATCHED");
  });

  it("should return the correct BetHistory for a non-scratched runner", () => {
    const mockBet = utils.mocks.getMockBet();
    const mockSignedBetData = utils.mocks.getMockSignedBetDataResponse();

    const betHistory = utils.bets.getBetHistory(mockBet, mockSignedBetData);

    expect(mockSignedBetData?.scratchedRunners?.length).toBeGreaterThan(0);
    expect(betHistory.propositionId).not.toBe(
      mockSignedBetData!.scratchedRunners![0].b16propositionId
    );
    expect(!!betHistory.scratched).not.toBe(true);
  });
});
