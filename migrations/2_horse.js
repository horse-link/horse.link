const Token = artifacts.require("Token.sol");
const HorseLink = artifacts.require("HorseLink");

module.exports = async (deployer) => {
  await deployer.deploy(Token);
  const token = await Token.deployed();

  await deployer.deploy(HorseLink, token.address);
};
