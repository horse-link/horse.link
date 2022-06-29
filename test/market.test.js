/* eslint-disable no-undef */
const Vault = artifacts.require("Vault");
const Market = artifacts.require("Market");
const Token = artifacts.require("MockToken");

const ethers = require("ethers");

contract("Market", (accounts) => {
  let market;
  let underlying;
  let vault;

  let owner = accounts[0];
  let alice = accounts[1];
  let bob = accounts[2];

  beforeEach(async () => {
    underlying = await Token.new("Mock USDT", "USDT");
    await underlying.transfer(alice, 2000);
    await underlying.transfer(bob, 1000);

    vault = await Vault.new(underlying.address);
    const fee = 100;

    market = await Market.new(vault.address, fee);
    vault.setMarket(market.address);

    await underlying.approve(vault.address, 1000, { from: alice });
    await vault.deposit(1000, { from: alice });
  });

  describe("Market", () => {
    it.only("should have 0 properties on deploy", async () => {
      const inPlay = await market.getTotalInplay();
      assert.equal(inPlay, 0, "Should have $0 play");

      const inPlayCount = await market.getInplayCount();
      assert.equal(inPlayCount, 0, "Should have 0 bets in play");

      const target = await market.getTarget();
      assert.equal(target, 100, "Should have fee of 1%");

      const maxPayout = await market.getMaxPayout.call(100, 5);
      assert.equal(maxPayout, 500, "Should be $500");
    });

    it("should allow a $100 punt at 5:1", async () => {
      // // check vault balance
      // const vaultBalance = await underlying.balanceOf(vault.address);
      // assert.equal(vaultBalance, 100, "Should have $100 USDT");

      // const totalAssets = await vault.totalAssets();
      // assert.equal(totalAssets, 100, "Should have $100 USDT");

      // // check the vault's performance
      // const vaultPerformance = await vault.getPerformance();
      // assert.equal(vaultPerformance, 100, "Vault performance should be 100 with no bets");

      const maxPayout = await market.getMaxPayout.call(100, 5);
      assert.equal(maxPayout, 5000, "Should be $5,000");

      const nonce = ethers.utils.formatBytes32String("60dfe1e0-8913-4024-b886-f832292ee6af");

      // Runner 1 for a Win
      const propositionId = ethers.utils.formatBytes32String("1");

      // Arbitary market ID set by the opperator
      const marketId = ethers.utils.formatBytes32String("20220115-BNE-R1-w");

      const wager = 100;

      // odds of 5 to 1 at 1_000 precission
      const odds = 5;
      const close = 0;
      const end = 1000000000000;

      const payload = `${nonce}${propositionId}${market}${wager}${odds}${close}${end}`;

      // sign
      const private_key = "0x29d6dec1a1698e7190a24c42d1a104d1d773eadf680d5d353cf15c3129aab729";
      const ethAccounts = new accounts();
      const signature = ethAccounts.sign(payload, private_key);

      
      await market.punt(nonce, propositionId, marketId, odds, close, end);
    });
  });
});
