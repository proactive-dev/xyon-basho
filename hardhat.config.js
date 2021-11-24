/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require('dotenv').config()

module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
    },
    local: {
      url: 'http://localhost:8545',
      accounts: [process.env.REACT_APP_PRIV_KEY]
    },
    matic: {
      url: 'https://polygon-rpc.com/',
      accounts: [process.env.REACT_APP_PRIV_KEY]
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      accounts: [process.env.REACT_APP_PRIV_KEY]
    }
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    disambiguatePaths: true
  },
  solidity: {
    version: "0.8.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./src/artifacts"
  }
}
