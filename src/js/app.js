App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    
    if(typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3  = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts()
  },

  initContracts: function() {
    $.getJSON("AMZTokenSale.json", function(amzTokenSale){
      App.contracts.AMZTokenSale = TruffleContract(amzTokenSale);
      App.contracts.AMZTokenSale.setProvider(App.web3Provider)
      App.contracts.AMZTokenSale.deployed().then(function(amzTokenSale){
        console.log('AMZ Token Sale Address: '+ amzTokenSale.address);
      });
    }).done(function(){
        $.getJSON("AMZToken.json", function(amzToken){
          App.contracts.AMZToken = TruffleContract(amzToken);
          App.contracts.AMZToken.setProvider(App.web3Provider);
          App.contracts.AMZToken.deployed().then(function(amzToken){
            console.log('AMZ Token Address: '+ amzToken.address);
          });
          App.listenForEvents();
          return App.render();
        });
    });
    // return App.render(); //GIVES PROMISE ERROR
  },

  buyTokens: function() {
    // console.log('AAAAA');
    $('#content').hide();
    $('.content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    console.log('No of Tokens: ' + numberOfTokens);
    App.contracts.AMZTokenSale.deployed().then(function(instance){
      console.log('AAAAA');
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000
      });
    }).then(function(result){
      console.log("Tokens bought...");
      console.log(result);
      $('form').trigger('reset'); // reset number of tokens in form
      // $('#loader').hide();
      // $('#content').show();
      //Wait for Sell event
    });
  },

  // Listens event emitted from the contract
  listenForEvents: function() {
    App.contracts.AMZTokenSale.deployed().then(function(instance){
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event){
      console.log('event triggered', event);
      App.render();
      });
    })
  },

  render: function() {
    // if (App.loading){
    //   console.log('aaa');
    //   return;
    // }
    // App.loading = true;

    var loader = $('#loader');
    var content = $('#content');
    var content_footer = $('.content')

    loader.show();
    content.hide();
    content_footer.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account){
      if(err === null){
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    });

    // Load token sale contract
    App.contracts.AMZTokenSale.deployed().then(function(instance){
      amzTokenSaleInstance = instance;
      return amzTokenSaleInstance.tokenPrice()
    }).then(function(tokenPrice){
      App.tokenPrice = tokenPrice.toNumber();
      $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether'));
      return amzTokenSaleInstance.tokensSold();
    }).then(function(tokensSold){
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      // Load token contract
      App.contracts.AMZToken.deployed().then(function(instance) {
        amzTokenInstance = instance;
        return amzTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        console.log('Balance: '+balance.toNumber());
        $('.amz-balance').html(balance.toNumber());

        // App.loading = false;
        loader.hide();
        content.show();
        content_footer.show();
        
      })
    });
    
  }
};

$(function(){
  $(window).load(function(){
    App.init();
  }); 
});