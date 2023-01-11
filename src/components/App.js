import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config.json';
// import EXCHANGE_ABI from '../abis/Exchange.json';

import { 
  loadProvider, 
  loadNetwork, 
  loadAccount,
  loadToken 
} from '../store/interactions';


function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    await loadAccount(dispatch)
  

    // Connect Ethers to blockchain:
      // Import ethers.js from ethers library (vanilla version), not hardhat library
      // Etheres is the library that lets us talk to the blockchain (turns app into a blockchain app)
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)

    // Token Smart Contract
    await loadToken(provider, config[chainId].DAPP.address, dispatch)

    
    // Exchange Smart Contract
    // const exchange = new ethers.Contract(config[chainId].exchange.address, EXCHANGE_ABI, provider)
    // console.log(exchange.address)
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
