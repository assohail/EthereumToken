App = {
  web3Provider: null,
  contracts: {},
  // account: '0x0',
  account:'0x0000000000000000000000000000000000000000',
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
      //check Metamask lock
      App.IsMetamaskLocked();
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3  = new Web3(web3.currentProvider);
    } else {
      // Specify default instance for ganache, if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

    IsMetamaskLocked: async function () {
    // await window.ethereum.enable(); // No need to enable this if MetaMask there
    // Other check for MetaMask after checking of web3 availability
    if(window.ethereum.isMetaMask){
      console.log('In metamask');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('accounts');
      console.log(accounts);
      // If MetaMask is not locked
      if (window.ethereum.selectedAddress){
        console.log('Address:' + ethereum.selectedAddress);
      } else {
        console.log('Account is locked');
      }
    } else {
      console.log('Pls install Meta Mask');
    }
    console.log('promise..................');
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // for(i=0; i<accounts.length; i++){
    //  console.log(accounts.length+" iter:"+ i+1);
    //  console.log(accounts);
    // }
    
    //const accounts = ethereum.eth_requestAccounts();
    //const account = accounts[0];
    //console.log('Ac:'+account);

    // When user changes account, reload the App for the new account
    window.ethereum.on('accountsChanged', function (accounts) {
      App.render();
    });

    //accounts(function(err, accounts){
    //  if (err != null) {
    //    console.log(err)
    //  }else if (accounts.length === 0) {
    //    console.log('MetaMask is locked')
    //  }else {
    //    console.log('MetaMask is unlocked')}
    //  });

    // console.log('before unlocked');
    // const isUnlocked = await window?.ethereum?._metamask.isUnlocked();
    // console.log('unlocked');
    // console.debug({ isUnlocked });

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
    
    // $('#content').hide();// commented for loader issue
    // $('.content').hide();
    // $('#loader').show();
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
        if (account){
          App.account = account;
          $('#accountAddress').html("Your Account: " + account);
        } else {
          $('#accountAddress').html("Account Not Selected: " + App.account);
        }
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