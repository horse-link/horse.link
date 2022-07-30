/* eslint-disable no-undef */
const Vault = artifacts.require("Vault");
const Market = artifacts.require("Market");
const Token = artifacts.require("MockToken");

const ethers = require("ethers");

contract("Market", accounts => {
  let market;
  let underlying;
  let vault;

  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const carol = accounts[3];

  const getMarketMakerSigner = () => {
      // // owner private key
      const private_key = "29d6dec1a1698e7190a24c42d1a104d1d773eadf680d5d353cf15c3129aab729";
      const signer = new ethers.Wallet(private_key);

      return signer;
  }

  beforeEach(async () => {
    underlying = await Token.new("Mock USDT", "USDT");
    await underlying.transfer(alice, 2000);
    await underlying.transfer(bob, 1000);
    await underlying.transfer(carol, 1000);

    vault = await Vault.new(underlying.address);
    const fee = 100;

    market = await Market.new(vault.address, fee);
    vault.setMarket(market.address);

    await underlying.approve(vault.address, 1000, { from: alice });
    await vault.deposit(1000, { from: alice });
  });

  describe("Market", () => {
    it("should have 0 properties on deploy", async () => {
      const inPlay = await market.getTotalInplay();
      assert.equal(inPlay, 0, "Should have $0 play");

      const inPlayCount = await market.getInplayCount();
      assert.equal(inPlayCount, 0, "Should have 0 bets in play");

      const target = await market.getTarget();
      assert.equal(target, 100, "Should have fee of 1%");

      const maxPayout = await market.getMaxPayout.call(100, 5);
      assert.equal(maxPayout, 500, "Should be $500");
    });

    it.only("should allow Bob a $100 punt at 5:1", async () => {
      let balance = await underlying.balanceOf(bob);
      assert.equal(balance, 1000, "Should have $1,000 USDT");

      const wager = 100;

      // odds of 5 to 1 at 1_000 precission
      const odds = 5;
      const close = 0;
      const end = 1000000000000;

      // check vault balance
      let vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, 1000, "Should have $1,000 USDT");

      const totalAssets = await vault.totalAssets();
      assert.equal(totalAssets, 1000, "Should have $1,000 USDT");

      await underlying.approve(market.address, 100, { from: bob });

      // Runner 1 for a Win
      const propositionId = ethers.utils.formatBytes32String("1");

      const trueodds = await market.getOdds.call(100, odds, propositionId);
      assert.equal(trueodds, 5, "Should be no slippage on $100 in a $1,000 pool");

      const nonce = ethers.utils.formatBytes32String("1");

      // Arbitary market ID set by the opperator
      const marketId = ethers.utils.formatBytes32String("20220115-BNE-R1-w");

      const payload = `${nonce}${propositionId}${marketId}${wager}${odds}${close}${end}`;

      // owner private key
      const private_key =
        "29d6dec1a1698e7190a24c42d1a104d1d773eadf680d5d353cf15c3129aab729";
      const signer = new ethers.Wallet(private_key);

      const signature = await signer.signMessage(payload);
      console.log(signature);

      await market.punt(
        nonce,
        propositionId,
        marketId,
        wager,
        odds,
        close,
        end,
        signature, { from: bob }
      );


      balance = await underlying.balanceOf(bob);
      assert.equal(balance, 900, "Should have $900 USDT after $100 bet");

      const inPlay = await market.getTotalInplay();
      assert.equal(inPlay, 600, "Should be $600 USDT in play after $100 bet @ 5:1");

      vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, 600, "Should have $600 USDT");
    });

    it.only("should allow Carol a $200 punt at 2:1", async () => {
      let balance = await underlying.balanceOf(carol);
      assert.equal(balance, 1000, "Should have $1,000 USDT");

      const wager = 200;

      // odds of 5 to 1 at 1_000 precission
      const odds = 2;
      const close = 0;
      const end = 1000000000000;

      // check vault balance
      const vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, 1000, "Should have $500 USDT");

      const totalAssets = await vault.totalAssets();
      assert.equal(totalAssets, 1000, "Should have $1,000 USDT");

      await underlying.approve(market.address, 200, { from: carol });

      // Runner 2 for a Win
      const propositionId = ethers.utils.formatBytes32String("2");

      const trueodds = await market.getOdds.call(200, odds, propositionId);
      assert.equal(trueodds, 2, "Should be no slippage on $200 in a $1,000 pool");

      const nonce = ethers.utils.formatBytes32String("2");

      // Arbitary market ID set by the opperator
      const marketId = ethers.utils.formatBytes32String("20220115-BNE-R1-w");

      const payload = `${nonce}${propositionId}${marketId}${wager}${odds}${close}${end}`;


      // const signature = await signer.signMessage(payload);
      // console.log(signature);

      // await market.punt(
      //   nonce,
      //   propositionId,
      //   marketId,
      //   wager,
      //   odds,
      //   close,
      //   end,
      //   signature, { from: bob }
      // );


      // balance = await underlying.balanceOf(bob);
      // assert.equal(balance, 900, "Should have $900 USDT after $100 bet");

      // const inPlay = await market.getTotalInplay();
      // assert.equal(inPlay, 600, "Should be $600 USDT in play after $100 bet @ 5:1");
    });
  });
});
