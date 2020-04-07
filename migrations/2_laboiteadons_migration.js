var LaBoiteADons = artifacts.require("LaBoiteADons")

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(LaBoiteADons, "0x0000000000000000000000000000000000000000")
  console.log("Deployed LaBoiteADons", LaBoiteADons.address)
}
