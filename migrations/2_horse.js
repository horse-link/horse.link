const LPToken = artifacts.require("LPToken");
const HorseLink = artifacts.require("HorseLink");

module.exports = async (deployer) => {
  await deployer.deploy(LPToken);
  const token = await LPToken.deployed();

  // await deployer.deploy(HorseLink, token.address);
};
