const { projectIdMainnet, mnemonicMainnet } = require('./secrets-mainnet.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 1e9,
      networkId: '*',
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        mnemonicMainnet, 
        `wss://rinkeby.infura.io/ws/v3/${projectIdMainnet}`
      ),
      network_id: 4,
      gasPrice: 1e9
    },
    ropsten: {
      provider: () => new HDWalletProvider(
        mnemonicMainnet, 
        `wss://ropsten.infura.io/ws/v3/${projectIdMainnet}`
      ),
      network_id: 3,
      gasPrice: 1e9
    },
    kovan: {
      provider: () => new HDWalletProvider(
        mnemonicMainnet, 
        `wss://kovan.infura.io/ws/v3/${projectIdMainnet}`
      ),
      network_id: 42,
      gasPrice: 1e9
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        mnemonicMainnet, 
        `wss://mainnet.infura.io/ws/v3/${projectIdMainnet}`
      ),
      network_id: 1,
      gasPrice: 50e9,
      gas: 6000000
    }
  }
};
