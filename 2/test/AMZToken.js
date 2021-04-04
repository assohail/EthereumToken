var AMZToken = artifacts.require("./AMZToken.sol");

contract('AMZToken', function(accounts) {
  var tokenInstance;

  it("Initializes the contract with the correct values", function(){
    return AMZToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name){
      assert.equal(name, 'AMZ Token', 'has the correct name');
      return tokenInstance.symbol();
    }).then(function(symbol){
      assert.equal(symbol, 'AMZ', 'has the correct symbol');
    })
    // .then(function(standard){
    //   assert.equal(standard, "AMZ Token v1.0", 'has correct standard');
    // })
  })
  it('sets the total supply upon deployment', function() {
    return AMZToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
    });
  });
})
