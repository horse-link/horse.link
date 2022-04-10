const Pool = artifacts.require("Pool");
const Market = artifacts.require("Market");
const Token = artifacts.require("MockToken");

contract("Market", (accounts) => {
  let token;
  let pool;

  let owner = accounts[0];
  let alice = accounts[1];

  beforeEach(async () => {
    token = await Token.new();
    await token.transfer(alice, 100);

    pool = await Pool.new(token.address);
  });

  describe("Market", () => {
    it("should have 0 properties on deploy", async () => {

    });
  });
});
