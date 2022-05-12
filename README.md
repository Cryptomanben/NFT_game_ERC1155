# NFT Farm

### About
Full stack Dapp that allows users to stake their tokens and earn points for doing so. They can use these points to redeem crop themed ERC-1155 NFTs.

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Truffle](https://www.trufflesuite.com/docs/truffle/overview) (Development Framework)
- [Ganache](https://www.trufflesuite.com/ganache) (For Local Blockchain)
- [Open Zeppelin](https://docs.openzeppelin.com/) (smart contract libraries)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Truffle](https://www.trufflesuite.com/docs/truffle/overview), In your terminal, you can check to see if you have truffle by running `truffle version`. To install truffle run `npm i -g truffle`. Ideal to have truffle version 5.4 to avoid dependency issues.
- Install [Ganache](https://www.trufflesuite.com/ganache). 

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ cd nft_farm
$ npm install
```
### 3. Start Ganache

### 4. Connect you ganache addresses to Metamask
- Copy private key of the addresses in ganache and import to Metamask
- Connect you metamask to ganache, network 127.0.0.1:7545.
- If you have not added ganache to the list of networks on your metamask, open up a browser, click the fox icon, then click the top center dropdown button that lists all the available networks then click add networks. A form should pop up. For the "Network Name" field enter "ganache". For the "New RPC URL" field enter "http://127.0.0.1:8545". For the chain ID enter "1337". Then click save.  


### 5. Migrate Smart Contracts
`truffle migrate --reset`

### 6. Run Tests
`$ truffle test`

### 7. Launch Frontend
`$ npm run start`

License
----
MIT

