require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  plugins: ["truffle-security", "solidity-coverage", "truffle-plugin-verify"],
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 6721975
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider({
          mnemonic: {
            phrase: process.env.GOERLI_MNEMONIC
          },
          providerOrUrl: process.env.GOERLI_URL
        });
      },
      network_id: 5,
      gas: 4500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    main: {
      provider: () => {
        return new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MAIN_MNEMONIC
          },
          providerOrUrl: process.env.MAIN_URL
        });
      },
      network_id: 1,
      //gas: 10000000,
      gas: 4600000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: false
    }
  },
  compilers: {
    solc: {
      version: "0.8.10"
    }
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "AUD"
    }
  },
  api_keys: {
    etherscan: 'MY_API_KEY'
  }
};
