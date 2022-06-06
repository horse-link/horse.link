/* eslint-disable no-undef */
const Vault = artifacts.require("Vault");
const Market = artifacts.require("Market");
const Token = artifacts.require("MockToken");

contract("Market", (accounts) => {
  let unerlying;
  let vault;

  let owner = accounts[0];
  let alice = accounts[1];

  beforeEach(async () => {
    token = await Token.new();
    await token.transfer(alice, 100);

    vault = await Vault.new(token.address);
  });

  describe("Market", () => {
    it("should have 0 properties on deploy", async () => {

    });
  });
});
