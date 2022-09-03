const HorseLink = artifacts.require("HorseLink");

contract("HorseLink", accounts => {
  let horse;

  beforeEach(async () => {
    horse = await HorseLink.new();
  });

  describe("results", () => {
    // it("should have 0 count", async () => {
    //   const count = await horse.count();
    //   assert.equal(count, 0, "Should have no values");
    // });
    
    // it("should add a result", async () => {
    //   await horse.addResult("0x414e47", 2021, 9, 18, 1, [12, 4, 8, 11]);
    //   const count = await horse.count();
    //   assert.equal(count, 1, "Should have no values");
    // });
  });
});
