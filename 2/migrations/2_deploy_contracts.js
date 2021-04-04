var AMZToken = artifacts.require("../contracts/AMZToken");

module.exports = function(deployer) {
  deployer.deploy(AMZToken, 1000000);
};
