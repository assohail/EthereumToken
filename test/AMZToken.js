var AMZToken = artifacts.require("./AMZToken.sol");

contract('AMZToken', function(accounts) {

  it('sets the total supply upon deployment', function() {
    return AMZToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
    });
  });
})
