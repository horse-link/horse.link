// const LPToken = artifacts.require("LPToken");
const MockToken = artifacts.require("MockToken");
const Market = artifacts.require("Market");
const Registry = artifacts.require("Registry");
const Vault = artifacts.require("Vault");

module.exports = async deployer => {
  await deployer.deploy(MockToken, "Mock USDT", "Horse Link USDT");
  const hlusdt = await MockToken.deployed();

  await deployer.deploy(MockToken, "Mock DIA", "Horse Link DIA");
  const hldai = await MockToken.deployed();

  await deployer.deploy(Vault, hlusdt.address);
  const usd_vault = await Vault.deployed();

  await deployer.deploy(Vault, hldai.address);
  const dia_vault = await Vault.deployed();

  await deployer.deploy(Market, dia_vault.address, 1);
  const dia_market = await Market.deployed();

  await deployer.deploy(Registry);
  const registry = await Registry.deployed();

  await registry.addVault(usd_vault.address);
  await registry.addVault(dia_vault.address);
  await registry.addMarket(dia_market.address);

  // await registry.addVault("0x00c23DC7a7B4b01b0008E2f9f45a558D76764dF6"); // usdc
  // await registry.addVault("0x25b49a6b3649D3Cbd3617B553Bedb98939967Fc9"); // dia
};
