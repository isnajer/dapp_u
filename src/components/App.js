import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import config from '../config.json';
import TOKEN_ABI from '../abis/Token.json';
import EXCHANGE_ABI from '../abis/Exchange.json';

import { 
  loadProvider, 
  loadNetwork, 
  loadAccount,
  loadToken 
} from '../store/interactions';
import store from '../store/store';



function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    const account = await loadAccount(dispatch)
  

    // Connect Ethers to blockchain:
      // Import ethers.js from ethers library (vanilla version), not hardhat library
      // Etheres is the library that lets us talk to the blockchain (turns app into a blockchain app)
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)
    

    console.log()

    // Token Smart Contracts
    await loadToken(provider, config[chainId].DAPP.address, dispatch)


    
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
