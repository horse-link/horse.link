/* eslint-disable no-undef */
const Vault = artifacts.require("Vault");
const Market = artifacts.require("Market");
const Token = artifacts.require("MockToken");

contract("Market", (accounts) => {
  let underlying;
  let vault;

  let owner = accounts[0];
  let alice = accounts[1];

  beforeEach(async () => {
    underlying = await Token.new("Mock USDT", "USDT");
    await underlying.transfer(alice, 2000);

    vault = await Vault.new(underlying.address);

    const fee = 100;
    market = await Market.new(vault.address, fee);

    vault.setMarket(market.address);

    await underlying.approve(vault.address, 100, { from: alice });
    await vault.deposit(100, { from: alice });
  });

  describe("Market", () => {
    it.only("should have 0 properties on deploy", async () => {
      const inPlay = await market.getTotalInplay();
      assert.equal(inPlay, 0, "Should have $0 play");

      const inPlayCount = await market.getInplayCount();
      assert.equal(inPlayCount, 0, "Should have 0 bets in play");

      const target = await market.getTarget();
      assert.equal(target, 100, "Should have fee of 1%");
    });

    it.only("should allow a $100 punt at 5:1", async () => {
      // check alice balance
      let balance = await underlying.balanceOf(alice);
      assert.equal(balance, 1900, "Should have $1,900 USDT");

      // check vault balance
      const vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, 100, "Should have $100 USDT");

      const totalAssets = await vault.totalAssets();
      assert.equal(totalAssets, 100, "Should have $100 USDT");

      // check the vault's performance
      const vaultPerformance = await vault.getPerformance();
      assert.equal(vaultPerformance, 100, "Vault performance should be 100 with no bets");
    });
  });
});
