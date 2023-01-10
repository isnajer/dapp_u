import { useEffect } from 'react';
import { ethers } from 'ethers';
import config from '../config.json';
import TOKEN_ABI from '../abis/Token.json';
import EXCHANGE_ABI from '../abis/Exchange.json';
import '../App.css';


function App() {

  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    console.log(accounts[0])

    // Connect Ethers to blockchain:
      // Import ethers.js from ethers library (vanilla version), not hardhat library
      // Etheres is the library that lets us talk to the blockchain (turns app into a blockchain app)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await provider.getNetwork()
    console.log(chainId)

    console.log()

    // Token Smart Contracts
    const token = new ethers.Contract(config[chainId].DAPP.address, TOKEN_ABI, provider)
    console.log(token.address)
    const symbol = await token.symbol()
    console.log(symbol)

    
    // Exchange Smart Contract
    const exchange = new ethers.Contract(config[chainId].exchange.address, EXCHANGE_ABI, provider)
    console.log(exchange.address)
    
  }

  // UseEffect for Data Fetching (blockchain data)
  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>  
  );
}

export default App;
