const Registry = artifacts.require("Registry");
const Vault = artifacts.require("Vault");
const Market = artifacts.require("Market");
const MockToken = artifacts.require("MockToken");

contract("Registry", () => {
  describe.only("Registry", () => {
    it("should have market and vault counts", async () => {
      const underlying = await MockToken.new("Mock USDT", "USDT");
      const registry = await Registry.new("0x0000000000000000000000000000000000000000");

      const market_count = await registry.marketCount();
      assert.equal(market_count, 0, "Should have no markets");

      const vault_count = await registry.vaultCount();
      assert.equal(vault_count, 0, "Should have no vaults");

      const vault = await Vault.new(underlying.address);
      const market = await Market.new(
        vault.address,
        1,
        "0x0000000000000000000000000000000000000000"
      );

      await registry.addMarket(market.address);
      const market_count2 = await registry.marketCount();
      assert.equal(market_count2, 1, "Should have 1 market");

      await registry.addVault(vault.address);
      const vault_count2 = await registry.vaultCount();
      assert.equal(vault_count2, 1, "Should have 1 vault");
    });
  });
});
