const DaiToken = artifacts.require('DaiToken')
const Crops = artifacts.require('Crops')
const NFTFarm = artifacts.require('NFTFarm')
function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}
const emissionRate = 1
const ids = [0,1,2,3,4,5]
const totals = [1000, 2000, 3000, 1, 2, 3]
const prices = [tokens('300'), tokens('150'), tokens('100'), tokens('300000'), tokens('150000'), tokens('100000')]
module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DAI Token
  await deployer.deploy(DaiToken, "Mock DAI Token", "mDAI")
  const daiToken = await DaiToken.deployed()

  // Deploy Crops ERC-1155 NFT
  await deployer.deploy(Crops)
  const crops = await Crops.deployed()

  // Deploy NFTFarm
  await deployer.deploy(NFTFarm, emissionRate, daiToken.address, crops.address)
  const nftFarm = await NFTFarm.deployed()

  // Approve NFTFarm to spend crop NFTs
  await crops.setApprovalForAll(nftFarm.address, true)

  // Add all crop NFTs to NFTFarm
  await nftFarm.addNFTs(ids, totals, prices)

  // Transfer 100 Mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
}
