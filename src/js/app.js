App = {
  web3Provider: null,
  contracts: {},
  // account: '0x0',
  account:'0x0000000000000000000000000000000000000000',
  account_balance: 0,
  sign: '',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 250000,
  tokensAvailable: 750000,

  
  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    
    if(typeof web3 !== 'undefined') {
      //check Metamask lock
      // App.isMetamaskLocked();
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3  = new Web3(web3.currentProvider);
    } else {
      // Specify default instance for ganache, if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    $('#exampleModal').modal('show');
    // return App.initContracts();
  },

  isMetamaskLocked: async function () {
  // await window.ethereum.enable(); // No need to enable this if MetaMask there
  // Other check for MetaMask after checking of web3 availability
  if(window.ethereum.isMetaMask){
      console.log('Meta Mask Detected!');
      await window.ethereum.request({ method: 'eth_requestAccounts' }).then(function(accounts){
        if(accounts.length !== 0){
          console.log('eth_Accounts:'+ accounts);
          App.account = accounts[0]
          console.log('Address added..')
        }else {
          console.log('Pls add Meta Mask account.');
        }
      })
    } else {
      console.log('Pls install Meta Mask');
    }
    
    // When user changes account, reload the App for the new account
    window.ethereum.on('accountsChanged', function (accounts) {
      App.render();
    });


    ethereum.on("chainChanged", (_chainId) => {
      window.location.reload();
    });
    
    ethereum.request({ method: "eth_chainId" }).then((_chainId) => {
    chainId = _chainId; 
    console.log(`Chain ID: ${chainId}`);
    });

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

  btnhandler: async function() {
    if (App.account === '0x0000000000000000000000000000000000000000') {
      await App.isMetamaskLocked();
      console.log('there')
    }
		// Asking if metamask is already present or not
		if (window.ethereum) {
			// res[0] for fetching a first wallet
			await window.ethereum
				.request({ method: "eth_requestAccounts" })
				.then((res) => {
					App.accountChangeHandler(res[0])
        });
		} else {
			alert("install metamask extension!!");
		}
	},

  	// Function for getting handling all events
	accountChangeHandler: (account) => {
		// Setting an address data
		// setdata({
		// 	address: account,
		// });
    App.account = account;

		// Setting a balance
		App.getbalance(account);
	},

  getbalance: (address) => {
		// Requesting balance method
		window.ethereum
			.request({
				method: "eth_getBalance",
				params: [address, "latest"],
			})
			.then((balance) => {
        console.log(balance)
				App.account_balance = web3.fromWei(balance, 'ether')
        $("#account_balance").html("Account Balance: " + App.account_balance)
        console.log(App.account_balance)
			});
	},

  /**
 * Sign In With Ethereum helper
 */
  
  siweSign: async (siweMessage) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(siweMessage);
      
      const from = App.account;
      const msg = `0x${Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('')}`;
      
      const sign = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from, 'Example password'],
      });
      App.sign = sign;
      console.log(sign)
    } catch (err) {
      console.error(err);
    }
  },


  /**
   * Sign In With Ethereum
   */
  siwe: async () => {
    const domain = window.location.host;
    if (App.account === '0x0000000000000000000000000000000000000000') {
      await App.isMetamaskLocked();
    }
    const from = App.account;
    console.log('App.account');
    console.log(App.account);
    
    const siweMessage = `${domain} wants you to sign in with your Ethereum account:\n${from}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: https://${domain}\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z`;
    await App.siweSign(siweMessage);
    if (App.sign !== null){
      $('#exampleModal').modal('hide');
      $('#logout').css('display', 'block');
      return App.initContracts();
    }
  },

  logout: function() {
    return window.location.reload();
  },

  buyTokens: function() {
    // $('#content').hide();// commented for loader issue
    // $('.content').hide();
    // $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    console.log('No of Tokens: ' + numberOfTokens);

    if (App.account != null && App.account !== '0x0000000000000000000000000000000000000000'){
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
    } else {
      window.location.reload();
    }
      
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
    
    // signature
    $('#signature').html("Sign: " + App.sign);

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