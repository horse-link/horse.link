/* eslint-disable no-undef */
const Vault = artifacts.require("Vault");
const Token = artifacts.require("MockToken");

contract("Vault", (accounts) => {
  let underlying;
  let vault;

  let owner = accounts[0];
  let alice = accounts[1];

  beforeEach(async () => {
    underlying = await Token.new("Mock USDT", "USDT");
    await underlying.transfer(alice, 2000);

    vault = await Vault.new(underlying.address);
  });

  describe("Vault", () => {
    it("should set properties on deploy", async () => {
      const totalSupply = await vault.totalSupply();
      assert.equal(totalSupply, 0, "Should have no tokens");

      const vaultPerformance = await vault.getPerformance();
      assert.equal(vaultPerformance, 0, "Should have no values");

      const _underlying = await vault.getUnderlying();
      assert.equal(_underlying, underlying.address, "Should have token address as underlying");

      // const market = await vault.getMarket();
      // assert.equal(market, "0x00", "Should have no market address");

      const name = await vault.name();
      assert.equal(name, "HL Mock USDT", "Should have name as HL Mock USDT");

      const symbol = await vault.symbol();
      assert.equal(symbol, "HLUSDT", "Should have name as HLUSDT");
    });

    it.only("should deposit $10 USDT underlying from alice", async () => {
      // check alice balance
      let balance = await underlying.balanceOf(alice);
      assert.equal(balance, 2000, "Should have $2,000 USDT");

      await underlying.approve(vault.address, 100, { from: alice });
      await vault.deposit(100, { from: alice });

      // // check alice balance
      // balance = await underlying.balanceOf(alice);
      // assert.equal(balance, 1900, "Should have $1,900 USDT");

      // // check vault balance
      // const vaultBalance = await underlying.balanceOf(vault.address);
      // assert.equal(vaultBalance, 100, "Should have $100 USDT");

      // const totalAssets = await vault.totalAssets();
      // assert.equal(totalAssets, 100, "Should have $100 USDT");




      // // check alice supply
      // const totalDeposited = await vault.deposited(alice);
      // assert.equal(totalDeposited, 10, "Should have 10 tokens");

      // // check the vault's performance
      // const vaultPerformance = await vault.getvaultPerformance();
      // assert.equal(vaultPerformance, 0, "vault performance should be 0 with no bets");
    });

    it("should exit from vault", async () => {
      // check alice balance
      let balance = await underlying.balanceOf(alice);
      assert.equal(balance, 100, "Should have 100 tokens");

      await underlying.approve(vault.address, 10, { from: alice });
      await vault.deposit(10, { from: alice });

      // check alice balance
      balance = await underlying.balanceOf(alice);
      assert.equal(balance, 90, "Should have 90 tokens");

      await vault.exit({ from: alice });

      balance = await underlying.balanceOf(alice);
      assert.equal(balance, 100, "Should have 100 tokens");
    });
  });
});
