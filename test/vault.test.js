/* eslint-disable no-undef */
const Token = artifacts.require("MockToken");
const Market = artifacts.require("Market");
const Vault = artifacts.require("Vault");

contract("Vault", accounts => {
  let underlying;
  let vault;
  let market;

  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];

  beforeEach(async () => {
    underlying = await Token.new("Mock USDT", "USDT");
    await underlying.transfer(alice, 2000, { from: owner });
    await underlying.transfer(bob, 2000, { from: owner });

    vault = await Vault.new(underlying.address);

    market = await Market.new(vault.address, 100); // todo: roll back bet.address
    await vault.setMarket(market.address);
  });

  describe("Vault", () => {
    it("should set properties on deploy", async () => {
      const fee = await market.getTarget();
      assert.equal(fee, 100, "Should have fee of 100");

      const totalSupply = await vault.totalSupply();
      assert.equal(totalSupply, 0, "Should have no tokens");

      const vaultPerformance = await vault.getPerformance();
      assert.equal(vaultPerformance, 0, "Should have no values");

      const _underlying = await vault.asset();
      assert.equal(
        _underlying,
        underlying.address,
        "Should have token address as underlying"
      );

      const _market = await vault.getMarket();
      assert.equal(_market, market.address, "Should have no market address");

      const name = await vault.name();
      assert.equal(name, "HL Mock USDT", "Should have name as HL Mock USDT");

      const symbol = await vault.symbol();
      assert.equal(symbol, "HLUSDT", "Should have name as HLUSDT");
    });

    it("should deposit $100 USDT from alice and have 100 shares", async () => {
      // check alice balance
      let balance = await underlying.balanceOf(alice);
      assert.equal(balance, 2000, "Should have $2,000 USDT");

      await underlying.approve(vault.address, 100, { from: alice });
      await vault.deposit(100, alice, { from: alice });

      // check alice balance
      balance = await underlying.balanceOf(alice);
      assert.equal(balance, 1900, "Should have $1,900 USDT");

      // check vault balance
      const vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, 100, "Should have $100 USDT");

      const totalAssets = await vault.totalAssets();
      assert.equal(totalAssets, 100, "Should have $100 USDT");

      // check the vault's performance
      const vaultPerformance = await vault.getPerformance();
      // assert.equal(
      //   vaultPerformance,
      //   100,
      //   "Vault performance should be 100 with no bets"
      // );

      const shareBalance = await vault.balanceOf(alice);
      assert.equal(shareBalance, 100, "Should have 100 shares");
    });

    it("should deposit $100 USDT from alice and bob and have correct amount of shares", async () => {
      await underlying.approve(vault.address, 100, { from: alice });
      await vault.deposit(100, alice, { from: alice });

      await underlying.approve(vault.address, 100, { from: bob });
      await vault.deposit(100, bob, { from: bob });

      // check vault balance
      const vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, 200, "Should have $200 USDT");

      const totalAssets = await vault.totalAssets();
      assert.equal(totalAssets, 200, "Should have $200 USDT");

      // check the vault's performance
      const vaultPerformance = await vault.getPerformance();
      // assert.equal(
      //   vaultPerformance,
      //   100,
      //   "Vault performance should be 100 with no bets"
      // );

      assert.equal(await vault.balanceOf(alice), 100, "Should have 100 shares");
      assert.equal(await vault.balanceOf(bob), 100, "Should have 100 shares");
    });

    it.skip("should exit from vault", async () => {
      // check alice balance
      let balance = await underlying.balanceOf(alice);
      assert.equal(balance, 100, "Should have 100 USDT");

      await underlying.approve(vault.address, 10, { from: alice });
      await vault.deposit(10, { from: alice });

      // check alice balance
      balance = await underlying.balanceOf(alice);
      assert.equal(balance, 90, "Should have 90 USDT");

      await vault.exit({ from: alice });

      balance = await underlying.balanceOf(alice);
      assert.equal(balance, 100, "Should have 100 USDT");
    });
  });
});
