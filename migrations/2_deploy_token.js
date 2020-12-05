// const GOStoken = artifacts.require("GOStoken");


// module.exports = (deployer) => {
//   deployer.deploy(GOStoken, 99999999999999, 'Game of Stawks Token', 2, 'GOST');
// };
require('dotenv').config({path: __dirname + '../.env'});
const file = process.env.CONTRACT || "GameOfStawksToken";
const GOStoken = artifacts.require(file);


module.exports = (deployer) => {
  deployer.deploy(GOStoken, 99999999999999, 2);
};