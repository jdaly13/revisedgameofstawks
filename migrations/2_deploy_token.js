const GOStoken = artifacts.require("GOStoken");


module.exports = (deployer) => {
  deployer.deploy(GOStoken, 99999999999999, 'Game of Stawks Token', 2, 'GOST');
};