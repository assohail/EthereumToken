const HDWalletProvider = require('truffle-hdwallet-provider');

require('dotenv').config(); // dotenv will start env specific var's from the env file to process.env
// heroku git:remote -a amz-ico-token
module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      // InfuraP1
      // provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/d11ebfb0fcd44dac8c671f139b7de6f1"),
      // InfuraP2
      // provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/1b69f3edcc6240d4959aedbb6ee49ed4"),
      // InfuraP3
      // provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/"+process.env.INFURA_API_KEY),

      //AMZ Balance Test
      provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/cf002d4904b04189b18959d162636e28"),
      network_id: 4,
    },
  }
};
