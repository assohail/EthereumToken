var AMZToken = artifacts.require("../contracts/AMZToken");
var AMZTokenSale = artifacts.require("../AMZTokenSale.sol");
module.exports = function(deployer) {
  deployer.deploy(AMZToken, 1000000).then(function(){ //1000000
    // token price is 0.001 ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(AMZTokenSale, AMZToken.address, tokenPrice);
  })
  
};
