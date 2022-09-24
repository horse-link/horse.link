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

  const DECIMALS = 6;

  const getMarketMakerSigner = () => {
    // owner private key
    const private_key = "29d6dec1a1698e7190a24c42d1a104d1d773eadf680d5d353cf15c3129aab729";
    const signer = new ethers.Wallet(private_key);

    return signer;
  };

  beforeEach(async () => {
    underlying = await Token.new("Mock USDT", "USDT");
    await underlying.transfer(alice, ethers.utils.parseUnits("2000", DECIMALS));
    await underlying.transfer(bob, ethers.utils.parseUnits("1000", DECIMALS));
    await underlying.transfer(carol, ethers.utils.parseUnits("1000", DECIMALS));

    vault = await Vault.new(underlying.address);
    const fee = 100;

    market = await Market.new(vault.address, fee);
    await vault.setMarket(market.address);

    // function allowance(address owner, address spender)
    const allowance = await underlying.allowance(vault.address, market.address);
    console.log("allowance " + Number(allowance));

    await underlying.approve(vault.address, ethers.utils.parseUnits("1000", DECIMALS), { from: alice });
    await vault.deposit(ethers.utils.parseUnits("1000", DECIMALS), alice, { from: alice });

    const balance = await underlying.balanceOf(vault.address);
    console.log("Vault balance of underlying " + Number(balance));
  });

  describe("Market", () => {
    it("should have 0 properties on deploy", async () => {
      const inPlay = await market.getTotalInplay();
      assert.equal(inPlay, 0, "Should have $0 play");

      const totalLiability = await market.getTotalLiability();
      assert.equal(totalLiability, 0, "Should have 0 liability");

      const target = await market.getTarget();
      assert.equal(target, 100, "Should have fee of 1%");

      const vault = await market.getVaultAddress();
      assert.equal(vault, vault, "Should have vault address");

      // const maxPayout = await market.getPotentailPayout.call(100, 5);
      // assert.equal(maxPayout, 500, "Should be $500");
    });

    it("should get correct odds on a 5:1 punt", async () => {
      let balance = await underlying.balanceOf(bob);
      assert.equal(balance, 1000000000, "Should have $1,000 USDT");

      const targetOdds = ethers.utils.parseUnits("5", DECIMALS);

      // check vault balance
      let vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, 1000000000, "Should have $1,000 USDT");

      const totalAssets = await vault.totalAssets();
      assert.equal(totalAssets, 1000000000, "Should have $1,000 USDT");

      await underlying.approve(market.address, ethers.utils.parseUnits("50", DECIMALS), { from: bob });

      // Runner 1 for a Win
      const propositionId = ethers.utils.formatBytes32String("1");

      const trueOdds = await market.getOdds.call(ethers.utils.parseUnits("50", DECIMALS), targetOdds, propositionId);
      assert.equal(trueOdds, 4750000, "Should have true odds of 1:4.75 on $50 in a $1,000 pool");

      const potentialPayout = await market.getPotentialPayout.call(propositionId, ethers.utils.parseUnits("50", DECIMALS), targetOdds);
      // should equal 237500000
      assert.equal(potentialPayout, 237500000, "Should have true odds of 1:4.75 on $100 in a $1,000 pool");
    });

    it("should allow Bob a $100 punt at 5:1", async () => {
      let balance = await underlying.balanceOf(bob);
      assert.equal(balance, 1000000000, "Should have $1,000 USDT");

      const wager = ethers.utils.parseUnits("100", 6);

      const odds = ethers.utils.parseUnits("5", DECIMALS);
      const close = 0;
      const end = 1000000000000;

      // check vault balance
      let vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, 1000000000, "Should have $1,000 USDT");

      let totalAssets = await vault.totalAssets();
      assert.equal(totalAssets, 1000000000, "Should have $1,000 USDT");

      await underlying.approve(market.address, ethers.utils.parseUnits("100", DECIMALS), { from: bob });

      // Runner 1 for a Win
      const propositionId = ethers.utils.formatBytes32String("1");
      const nonce = ethers.utils.formatBytes32String("1");

      // Arbitary market ID set by the opperator
      const marketId = ethers.utils.formatBytes32String("20220115-BNE-R1-w");

      // owner private key
      const private_key = "29d6dec1a1698e7190a24c42d1a104d1d773eadf680d5d353cf15c3129aab729";
      const signer = new ethers.Wallet(private_key);

      const payload = `${nonce}${propositionId}${marketId}${wager}${odds}${close}${end}`;
      const signature = await signer.signMessage(payload);
      console.log(signature);

      // function back(bytes32 nonce, bytes32 propositionId, bytes32 marketId, uint256 wager, uint256 odds, uint256 close, uint256 end, bytes calldata signature) external returns (uint256) {
      await market.back(nonce, propositionId, marketId, wager, odds, close, end, signature, { from: bob });

      balance = await underlying.balanceOf(bob);
      assert.equal(Number(balance), ethers.utils.parseUnits("900", DECIMALS), "Should have $900 USDT after $100 bet");

      const inPlay = await market.getTotalInplay();
      assert.equal(Number(inPlay), ethers.utils.parseUnits("450", DECIMALS), "Should be $450 USDT in play after $100 bet @ 1:4.5");

      vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(Number(vaultBalance), ethers.utils.parseUnits("650", DECIMALS), "Should have $650 USDT left in the vault");

      // totalAssets = await vault.totalAssets();
      // assert.equal(totalAssets, 1000000000, "Should have $1,000 USDT");
    });

    it.skip("should allow Carol a $200 punt at 2:1", async () => {
      let balance = await underlying.balanceOf(carol);
      assert.equal(balance, ethers.utils.formatEther(1000, DECIMALS), "Should have $1,000 USDT");

      const wager = ethers.utils.parseUnits("200", 6);

      const odds = ethers.utils.parseUnits("2", DECIMALS);
      const close = 0;
      const end = 1000000000000;

      // check vault balance
      const vaultBalance = await underlying.balanceOf(vault.address);
      assert.equal(vaultBalance, ethers.utils.formatEther(1000, DECIMALS), "Should have $500 USDT");

      const totalAssets = await vault.totalAssets();
      assert.equal(totalAssets, ethers.utils.formatEther(1000, DECIMALS), "Should have $1,000 USDT");

      await underlying.approve(market.address, 200, { from: carol });

      // Runner 2 for a Win
      const propositionId = ethers.utils.formatBytes32String("2");

      const trueodds = await market.getOdds.call(200, odds, propositionId);
      assert.equal(trueodds, 2, "Should be no slippage on $200 in a $1,000 pool");

      const nonce = ethers.utils.formatBytes32String("2");

      // Arbitary market ID set by the opperator
      const marketId = ethers.utils.formatBytes32String("20220115-BNE-R1-w");

      const payload = `${nonce}${propositionId}${marketId}${wager}${odds}${close}${end}`;

      const signature = await signer.signMessage(payload);
      console.log(signature);

      // await market.back(
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
