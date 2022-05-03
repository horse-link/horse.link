const Vault = artifacts.require("Vault");
const Token = artifacts.require("MockToken");

contract("Vault", (accounts) => {
  let token;
  let vault;

  let owner = accounts[0];
  let alice = accounts[1];

  beforeEach(async () => {
    token = await Token.new();
    await token.transfer(alice, 100);

    vault = await Vault.new(token.address);
  });

  describe("Vault", () => {
    it("should have 0 properties on deploy", async () => {
      const totalSupplied = await vault.totalSupplied();
      assert.equal(totalSupplied, 0, "Should have no values");

      const underlyingBalance = await vault.getUnderlyingBalance();
      assert.equal(underlyingBalance, 0, "Should have no values");

      const vaultPerformance = await vault.getvaultPerformance();
      assert.equal(vaultPerformance, 0, "Should have no values");

      const underlying = await vault.getUnderlying();
      assert.equal(underlying, token.address, "Should have token address as underlying");

      const market = await vault.getMarket();
      assert.equal(market, "0x00", "Should have no market address");
    });

    it("should deposit 10 underlying tokens from alice", async () => {
      await token.approve(vault.address, 10, { from: alice });
      await vault.deposit(10, { from: alice });

      // check alice balance
      const balance = await token.balanceOf(alice);
      assert.equal(balance, 90, "Should have 90 tokens");

      // check vault balance
      const vaultBalance = await token.balanceOf(vault.address);
      assert.equal(vaultBalance, 10, "Should have 10 tokens");

      // check alice supply
      const totalDeposited = await vault.deposited(alice);
      assert.equal(totalDeposited, 10, "Should have 10 tokens");

      // // check the vault's performance
      // const vaultPerformance = await vault.getvaultPerformance();
      // assert.equal(vaultPerformance, 0, "vault performance should be 0 with no bets");
    });

    it("should exit from vault", async () => {
      // check alice balance
      let balance = await token.balanceOf(alice);
      assert.equal(balance, 100, "Should have 100 tokens");

      await token.approve(vault.address, 10, { from: alice });
      await vault.deposit(10, { from: alice });

      // check alice balance
      balance = await token.balanceOf(alice);
      assert.equal(balance, 90, "Should have 90 tokens");

      await vault.exit({ from: alice });

      balance = await token.balanceOf(alice);
      assert.equal(balance, 100, "Should have 100 tokens");
    });
  });
});
