const LPToken = artifacts.require("LPToken");
const MockToken = artifacts.require("MockToken");
const HorseLink = artifacts.require("HorseLink");

module.exports = async (deployer) => {
  await deployer.deploy(MockToken, "USDT", "Mock USDT");
  const usdt = await MockToken.deployed();

  await deployer.deploy(MockToken, "DIA", "Mock DIA");
  const dia = await MockToken.deployed();

  await deployer.deploy(LPToken, "hlUSDT", "Horse Link USDT");
  const hlusdt = await LPToken.deployed();

  await deployer.deploy(LPToken, "hlDIA", "Horse Link DIA");
  const hldai = await LPToken.deployed();

  // await deployer.deploy(HorseLink, token.address);
};
