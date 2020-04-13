var HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  contracts_build_directory: "./src/contracts",
  networks: {
    rinkeby: {
      provider: new HDWalletProvider(process.env.RINKEBY_WALLET_MNEMONIC, "https://rinkeby.infura.io/v3/"+process.env.INFURA_PROJECT_ID),
      network_id: 4,
      skipDryRun: true
    }
  }
}