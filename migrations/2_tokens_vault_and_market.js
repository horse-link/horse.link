const MockToken = artifacts.require("MockToken");
const Market = artifacts.require("Market");
const Registry = artifacts.require("Registry");
const Vault = artifacts.require("Vault");

module.exports = async deployer => {
  let hlusdtAddress = "0xaF2929Ed6758B0bD9575e1F287b85953B08E50BC";
  let hldaiAddress = "0x70b481B732822Af9beBc895779A6e261DC3D6C8B";

  const redploy_tokens = false;
  const fund_vaults = false;

  if (redploy_tokens) {
    await deployer.deploy(MockToken, "Mock USDT", "Horse Link USDT");
    const hlusdt = await MockToken.deployed();
    hlusdtAddress = hlusdt.address;

    await deployer.deploy(MockToken, "Mock DAI", "Horse Link DAI");
    const hldai = await MockToken.deployed();
    hldaiAddress = hldai.address;
  }

  await deployer.deploy(Vault, hlusdtAddress);
  const usd_vault = await Vault.deployed();

  await deployer.deploy(Vault, hldaiAddress);
  const dai_vault = await Vault.deployed();

  if (fund_vaults) {
  }

  await deployer.deploy(Market, dai_vault.address, 1, "0x0000000000000000000000000000000000000000");
  const dia_market = await Market.deployed();

  await deployer.deploy(Registry);
  const registry = await Registry.deployed();

  await registry.addVault(usd_vault.address);
  await registry.addVault(dai_vault.address);
  await registry.addMarket(dia_market.address);

  // await registry.addVault("0x00c23DC7a7B4b01b0008E2f9f45a558D76764dF6"); // usdc
  // await registry.addVault("0x25b49a6b3649D3Cbd3617B553Bedb98939967Fc9"); // dai
};
