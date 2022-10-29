/* eslint-disable no-undef */
const Vault = artifacts.require("Vault");
const Market = artifacts.require("Market");
const Token = artifacts.require("MockToken");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { constants, utils } = require("ethers");

contract("Market", accounts => {
  let market;
  let underlying;
  let vault;

  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const carol = accounts[3];

  const DECIMALS = 6;
  const FEE = 100;

  const ownerSign = async message => {
    // owner private key
    const private_key =
      "29d6dec1a1698e7190a24c42d1a104d1d773eadf680d5d353cf15c3129aab729";
    const signer = new Wallet(private_key);

    const signature = await signer.signMessage(message);
    console.log(signature);

    return signature;
  };

  beforeEach(async () => {
    underlying = await Token.new("Mock USDT", "USDT");
    await underlying.transfer(alice, utils.parseUnits("2000", DECIMALS));
    await underlying.transfer(bob, utils.parseUnits("1000", DECIMALS));
    await underlying.transfer(carol, utils.parseUnits("1000", DECIMALS));

    vault = await Vault.new(underlying.address);

    market = await Market.new(vault.address, FEE, constants.AddressZero);
    await vault.setMarket(market.address);

    await underlying.approve(
      vault.address,
      utils.parseUnits("1000", DECIMALS),
      { from: alice }
    );

    await vault.deposit(utils.parseUnits("1000", DECIMALS), alice, {
      from: alice
    });

    await underlying.approve(
      market.address,
      utils.parseUnits("100", DECIMALS),
      { from: bob }
    );
  });

  describe.only("Settle", () => {
    it("should settle by index", async () => {
      const wager = utils.parseUnits("100", 6);

      const odds = utils.parseUnits("5", DECIMALS);
      const close = 0;
      const end = 1000000000000;

      // Runner 1 for a Win
      const propositionId = utils.formatBytes32String("1");
      const nonce = utils.formatBytes32String("1");

      // Arbitary market ID set by the opperator `${today}_${track}_${race}_W${runner}`
      const marketId = utils.formatBytes32String("20220115_BNE_1_W");
      const payload = `${nonce}${propositionId}${marketId}${wager}${odds}${close}${end}`;

      const signature = ownerSign(payload);

      let index = await market.getCount();
      assert.equal(index, 0, "First bet should have a 0 index");

      await market.back(
        nonce,
        propositionId,
        marketId,
        wager,
        odds,
        close,
        end,
        signature,
        { from: bob }
      );

      index = await market.getCount();
      assert.equal(index, 1, "First bet should have a 1 index");

      contract.settle(market);
    });
  });
});
