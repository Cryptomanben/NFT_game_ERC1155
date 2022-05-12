 const DaiToken = artifacts.require('DaiToken')
const Crops = artifacts.require('Crops')
const NFTFarm = artifacts.require('NFTFarm')
const { expectRevert, time } = require('@openzeppelin/test-helpers')

export const futureTime = (seconds) => {
  return (+Math.floor(new Date().getTime()/1000.0) + +seconds)
}

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}
const fromWei = (num) => web3.utils.fromWei(num.toString())

contract("NFTFarm", ([owner, investor]) => {
  let daiToken, crops, nftFarm
  const emissionRate = 1
  const ids = [0,1,2,3,4,5]
  const totals = [1000, 2000, 3000, 1, 2, 3]
  const prices = [tokens('300'), tokens('150'), tokens('100'), tokens('300000'), tokens('150000'), tokens('100000')]
  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new("Mock DAI Token", "mDAI")
    crops = await Crops.new()
    nftFarm = await NFTFarm.new(emissionRate, daiToken.address, crops.address)
    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  });

  describe('Deployment', async () => {
    it('tracks emision rate', async () => {
      const result = await nftFarm.emissionRate()
      result.toString().should.equal(emissionRate.toString())
    })
    it('tracks ERC-1155 Crops NFT address', async () => {
      const result = await nftFarm.crops()
      result.should.equal(crops.address)
    })
    it('tracks mDai token address', async () => {
      const result = await nftFarm.token()
      result.should.equal(daiToken.address)
    })
  })

  describe('Farming NFTs', async() => {

    it('rewards stakers with points that they can use to redeem NFTs', async () => {
      let result
      // Check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')
      
      // Owner adds NFTs to farm
      await crops.setApprovalForAll(nftFarm.address, true, {from: owner})
      await nftFarm.addNFTs(ids, totals, prices, {from: owner})
      const finalNFTCount = await nftFarm.nftCount()
      expect(finalNFTCount.toString()).to.equal(ids.length.toString())

      // investor stakes mock dai tokens
      await daiToken.approve(nftFarm.address, tokens('1'), {from: investor})
      await nftFarm.stakeTokens(tokens('1'), {from: investor})
      const finalFarmTokenBal = await daiToken.balanceOf(nftFarm.address)
      expect(finalFarmTokenBal.toString()).to.equal(tokens('1').toString())

      // increases investor's Points balance after 700 seconds passed. Should return approx. 700 points.
      const iniPointsBal = await nftFarm.pointsBalance(investor)
      await time.increase("700")
      const finalPointsBal = await nftFarm.pointsBalance(investor)
      expect(+finalPointsBal).to.equal(+iniPointsBal.toString() + +tokens('700').toString())

      // allows investor to claim multiple farmed NFTs priced at a total cost than 700 points
      // Investor will redeem 3 corns and 2 potato crop NFTs, which totals to 600
      await nftFarm.claimNFTs(["2", "1"], ["3","2"], {from: investor})
      const finalNFTCornBal = await crops.balanceOf(investor, "2")
      const finalNFTPotatoBal = await crops.balanceOf(investor, "1")
      expect((+finalNFTCornBal.toString() + +finalNFTPotatoBal.toString()).toString()).to.equal('5')

      // allows investor to unstake tokens
      const iniTokenBal = await daiToken.balanceOf(investor)
      const stakedBal = (await nftFarm.userInfo(investor)).stakedAmount
      await nftFarm.unstakeTokens({from: investor})
      const finalTokenBal = await daiToken.balanceOf(investor)
      expect(+finalTokenBal.toString()).to.equal(+iniTokenBal.toString() + +stakedBal.toString())
    })

  })  
})

