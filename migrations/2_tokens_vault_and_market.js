const HorseLink = artifacts.require("HorseLink");
const MockToken = artifacts.require("MockToken");
const Market = artifacts.require("Market");
const Registry = artifacts.require("Registry");
const Vault = artifacts.require("Vault");

module.exports = async deployer => {
  const deploy_registry = true;

  await deployer.deploy(HorseLink);
  const horseLink = await HorseLink.deployed();

  let registry = "0x5Df377d600A40fB6723e4Bf10FD5ee70e93578da";

  if (deploy_registry) {
    await deployer.deploy(Registry, horseLink.address);
    registry = await Registry.deployed();
  }

  let hlusdtAddress = "0xaF2929Ed6758B0bD9575e1F287b85953B08E50BC";
  let hldaiAddress = "0x70b481B732822Af9beBc895779A6e261DC3D6C8B";

  const redploy_tokens = false;
  //const fund_vaults = false;

  if (redploy_tokens) {
    await deployer.deploy(MockToken, "Mock USDT", "Horse Link USDT");
    const hlusdt = await MockToken.deployed();
    hlusdtAddress = hlusdt.address;

    await deployer.deploy(MockToken, "Mock DIA", "Horse Link DIA");
    const hldai = await MockToken.deployed();
    hldaiAddress = hldai.address;
  }

  await deployer.deploy(Vault, hlusdtAddress);
  const usd_vault = await Vault.deployed();

  await deployer.deploy(Vault, hldaiAddress);
  const dai_vault = await Vault.deployed();

  // if (fund_vaults) {

  // }

  await deployer.deploy(
    Market,
    dai_vault.address,
    1,
    "0x0000000000000000000000000000000000000000"
  );
  const dia_market = await Market.deployed();

  if (deploy_registry) {
    await registry.addVault(usd_vault.address);
    await registry.addVault(dai_vault.address);
    await registry.addMarket(dia_market.address);
  }
};
