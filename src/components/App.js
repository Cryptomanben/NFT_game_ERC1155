import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import './App.css'
import Navbar from './Navbar'
import Main from './Main'
import DaiToken from '../abis/DaiToken.json'
import Crops from '../abis/Crops.json'
import NFTFarm from '../abis/NFTFarm.json'

const futureTime = (seconds) => {
  return (+Math.floor(new Date().getTime()/1000.0) + +seconds)
} 

const CROP_ARRAY = [
  {
    id: 0,
    name: "carrot",
    image: "https://ipfs.io/ipfs/bafkreib6uhqu4h22ii2b2mlk3qetekjs27w4pyoaqxcuqgkcl2yjkjuvb4"
  },
  {
    id: 1,
    name: "potato",
    image: "https://ipfs.io/ipfs/bafkreia773gxzvwioptbs7paxcstho2amkmmanj2fzexitxhmokamy43fu"
  },
  {
    id: 2,
    name: "corn",
    image: "https://ipfs.io/ipfs/bafybeidhfgjqtinwfbqd267tntjmmzkrngkr2jolvbzksh7kayxr7ndeom"
  },
  {
    id: 3,
    name: "golden-carrot",
    image: "https://ipfs.io/ipfs/bafkreiecspw7et4pof4iadgmuvwrmsqi3bcplu5rmnihpr7yxscf7se2oi"
  },
  {
    id: 4,
    name: "sprouting-potato",
    image: "https://ipfs.io/ipfs/bafkreifo3gn27ddsbviumbywxhlb5qhb3b7v3tu3cl5ttt32nldmwrkhci"
  },
  {
    id: 5,
    name: "rainbow-corn",
    image: "https://ipfs.io/ipfs/bafybeigqufvvagqba2d4a7qotqlyz4qcef3rjhyoo2ztyet5wivvkr5qpq"
  },
]

function App() {
  const [networkId, setNetworkId] = useState(null)
  const [account, setAccount] = useState(null)
  const [daiToken, setDaiToken] = useState({})
  const [nftFarm, setNFTFarm] = useState({})
  const [listedCrops, setListedCrops] = useState({})
  const [collectedCrops, setCollectedCrops] = useState([])
  const [daiTokenBalance, setDaiTokenBalance] = useState('0')
  const [pointsBalance, setPointsBalance] = useState('0')
  const [stakingBalance, setStakingBalance] = useState('0')
  const [totalCost, setTotalCost] = useState(0)
  const [quantities, setQuantities] = useState([])
  const [loading, setLoading] = useState(true)
  const [signer, setSigner] = useState(null)
  const [message, setMessage] = useState("Awaiting MetaMask Connection...")

  const loadWeb3 = async () => {
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    setSigner(signer)

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', function (accounts) {
      setAccount(accounts[0])
    })
  }
  const loadBlockchainData = async () => {
    setTotalCost(0)
    setMessage("Loading Contracts...")
    const crops = new ethers.Contract(Crops.networks[networkId].address, Crops.abi, signer)
    const daiToken = new ethers.Contract(DaiToken.networks[networkId].address, DaiToken.abi, signer)
    setDaiToken(daiToken)
    const nftFarm = new ethers.Contract(NFTFarm.networks[networkId].address, NFTFarm.abi, signer)
    setNFTFarm(nftFarm)
    setMessage("Loading BlockchainData")
    const daiTokenBalance = await daiToken.balanceOf(account)
    setDaiTokenBalance(daiTokenBalance)
    const userInfo = await nftFarm.userInfo(account)
    const stakedAmount = userInfo.stakedAmount
    setStakingBalance(stakedAmount)
    const pointsDebt = userInfo.pointsDebt
    const emissionRate = await nftFarm.emissionRate()
    const pointsBalance = +ethers.utils.formatUnits(pointsDebt, 'ether') + +(futureTime(0) - (+userInfo.lastUpdateAt))*(+emissionRate)*(+ethers.utils.formatUnits(stakedAmount, 'ether'))
    console.log(+stakedAmount)
    setPointsBalance(pointsBalance)
    const nftCount = await nftFarm.nftCount()
    const collectedCrops = []
    let listedCrops = []
    let quantities = []
    for (let i = 0; i < nftCount; i++) {
      const listedCrop = await nftFarm.nftInfo(i)
      const collectedCrop = await crops.balanceOf(account, i)
      collectedCrops.push(collectedCrop.toNumber())
      listedCrops.push(listedCrop)
      quantities.push(0)
    }
    let string = ''
    collectedCrops.forEach(
      (value, index, array) =>
        value > 0 ? string = string + `${value} ${CROP_ARRAY[index].name}${value > 1 ? 's' : ''}${+index + 1 !== array.length ? ',' : ''} `
          : null
    )
    setCollectedCrops(string)
    setQuantities(quantities)
    setListedCrops(listedCrops)
    setLoading(false)
  }
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    setNetworkId(window.ethereum.networkVersion)
  }
  useEffect(() => {
    if (networkId) {
      loadWeb3()
    }
  }, [networkId]);

  useEffect(() => {
    if (signer) {
      loadBlockchainData()
    }
  }, [signer]);

  const stakeTokens = async (amount) => {
    setLoading(true)
    setMessage("Loading..")
    await daiToken.approve(nftFarm.address, amount)
    const result = await nftFarm.stakeTokens(amount)
    await result.wait()
    await loadBlockchainData()
  }

  const unstakeTokens = async (amount) => {
    setLoading(true)
    setMessage("Loading...")
    const result = await nftFarm.unstakeTokens()
    await result.wait()
    await loadBlockchainData()
  }
  const claimNFTs = async (quantities) => {
    setLoading(true)
    setMessage("Loading...")
    let selectedCrops = []
    let amounts = quantities.filter(i => i !== 0)
    quantities.forEach((i, index) => i > 0 ? selectedCrops.push(index) : null)
    const result = await nftFarm.claimNFTs(selectedCrops, amounts)
    await result.wait()
    await loadBlockchainData()
  }


  return (
    <div>
      <Navbar web3Handler={web3Handler} account={account} />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <Spinner animation="border" style={{ display: 'flex' }} />
          <p className='mx-3 my-0'>{message}</p>
        </div>
      ) : (
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '600px' }}>
              <div className="content mx-auto">
                <Main
                  daiTokenBalance={daiTokenBalance}
                  pointsBalance={pointsBalance}
                  stakingBalance={stakingBalance}
                  stakeTokens={stakeTokens}
                  unstakeTokens={unstakeTokens}
                />
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {listedCrops.map((crop, key) => {
              console.log(crop.id.toNumber())
              return (
                <div key={key} className="col-md-2 mb-2">
                  <img src={CROP_ARRAY[crop.id.toNumber()].image} alt = '' className='mw-100' />
                  <div>Price: {ethers.utils.formatUnits(crop.price, 'ether')}</div>
                  <div>{crop.remaining.toNumber()} in stock</div>
                  <input
                    type='number'
                    className='form-control mb-1'
                    placeholder='Quantity'
                    onChange={event => {
                      quantities[key] = event.target.value ? event.target.value : 0
                      console.log(quantities)
                      console.log(+listedCrops[0].price.toString())
                      setQuantities(quantities)
                      setTotalCost(quantities.reduce((prev, i, index) =>
                        +prev.toString() + +(+i * +listedCrops[index].price.toString()).toString(),
                        0
                      ))
                    }}
                  />
                </div>
              )
            })}
          </div>
          <div className="row">
            <main role="main" className="col-lg-12 justify-content-center d-flex mx-auto text-center">
              <div className="content mr-auto ml-auto">
                <span>Total: {totalCost / (10 ** 18)} points</span>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  claimNFTs(quantities)
                }}>
                  <input
                    type='submit'
                    className='btn-lg btn-block btn-primary'
                    value='CLAIM NFT CROPs'
                  />
                </form>
              </div>
            </main>
          </div>
          <main role="main" className="col-lg-12 justify-content-center d-flex mx-auto text-center">

            <h5>Crops Collected:
              <span id="result">&nbsp;{collectedCrops}</span>
            </h5>
            <div className="grid mb-4" >
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
export default App;
