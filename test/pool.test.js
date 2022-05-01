const Pool = artifacts.require("Pool");
const Token = artifacts.require("MockToken");

contract("Pool", (accounts) => {
  let token;
  let pool;

  let owner = accounts[0];
  let alice = accounts[1];

  beforeEach(async () => {
    token = await Token.new();
    await token.transfer(alice, 100);

    pool = await Pool.new(token.address);
  });

  describe("Pool", () => {
    it("should have 0 properties on deploy", async () => {
      const totalSupplied = await pool.totalSupplied();
      assert.equal(totalSupplied, 0, "Should have no values");

      const underlyingBalance = await pool.getUnderlyingBalance();
      assert.equal(underlyingBalance, 0, "Should have no values");

      const poolPerformance = await pool.getPoolPerformance();
      assert.equal(poolPerformance, 0, "Should have no values");

      const underlying = await pool.getUnderlying();
      assert.equal(underlying, token.address, "Should have token address as underlying");

      const market = await pool.getMarket();
      assert.equal(market, "0x00", "Should have no market address");
    });

    it("should deposit 10 underlying tokens from alice", async () => {
      await token.approve(pool.address, 10, { from: alice });
      await pool.deposit(10, { from: alice });

      // check alice balance
      const balance = await token.balanceOf(alice);
      assert.equal(balance, 90, "Should have 90 tokens");

      // check pool balance
      const poolBalance = await token.balanceOf(pool.address);
      assert.equal(poolBalance, 10, "Should have 10 tokens");

      // check alice supply
      const totalDeposited = await pool.deposited(alice);
      assert.equal(totalDeposited, 10, "Should have 10 tokens");

      // // check the pool's performance
      // const poolPerformance = await pool.getPoolPerformance();
      // assert.equal(poolPerformance, 0, "Pool performance should be 0 with no bets");
    });

    it("should exit from pool", async () => {
      // check alice balance
      let balance = await token.balanceOf(alice);
      assert.equal(balance, 100, "Should have 100 tokens");

      await token.approve(pool.address, 10, { from: alice });
      await pool.deposit(10, { from: alice });

      // check alice balance
      balance = await token.balanceOf(alice);
      assert.equal(balance, 90, "Should have 90 tokens");

      await pool.exit({ from: alice });

      balance = await token.balanceOf(alice);
      assert.equal(balance, 100, "Should have 100 tokens");
    });
  });
});
