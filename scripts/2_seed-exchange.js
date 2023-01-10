const config = require('../src/config.json')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

// For running script against main-net. Watch your script wait in realtime. / (especially in Test Network vs Mainnet scenarios):
const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
    // Fetch accounts from wallet - these are unlocked
    const accounts = await ethers.getSigners()

    // Fetch Network
    const { chainId } = await ethers.provider.getNetwork()
    console.log("Using chainId:", chainId)


    const DAPP = await ethers.getContractAt('Token', config[chainId].DAPP.address)
    console.log(`Dapp Token fetched: ${DAPP.address}\n`)

    const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)
    console.log(`mETH Token fetched: ${mETH.address}\n`)

    const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)
    console.log(`mDAI Token fetched: ${mDAI.address}\n`)

    // Fetch deployed exchange
    const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
    console.log(`Exchange fetched: ${exchange.address}\n`)

    // Give teokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)

    // user1 transfers 10,000 mETH...
    let transaction, result
    transaction = await mETH.connect(sender).transfer(receiver.address, amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    // Set up exchange users
    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = tokens(10000)

    // User1 Approves 10,000 DAPP...
    transaction = await DAPP.connect(user1).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user1.address}`)

    // User1 Deposits 10,000 DAPP
    transaction = await exchange.connect(user1).depositToken(DAPP.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} Ether from ${user1.address}\n`)

    // User2 Approves mETH
    transaction = await mETH.connect(user2).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user2.address}`)

    // User2 Deposits mETH
    transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user2.address}\n`)


    // Seed a Cancelled Order:
    // User1 Makes Order to Get Tokens
    let orderId 
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), DAPP.address, tokens(5))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User1 Cancels Order - (get orderId from the event in 'exchange.js' -> 'it('emits an Order event') section...)
    orderId = result.events[0].args.id 
    transaction = await exchange.connect(user1).cancelOrder(orderId)
    result = await transaction.wait()
    console.log(`Cancelled order from ${user1.address}\n`)

    // Wait 1 second / For setTimeout function
    await wait(1)


    // Seed a Filled Order:
    // User1 Makes Order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), DAPP.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User2 Fills Order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait for 1 second
    await wait(1)

    // User1 Makes Another Order
    transaction = await exchange.makeOrder(mETH.address, tokens(50), DAPP.address, tokens(15))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User2 Fills Another Order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    // User1 Makes Final Order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), DAPP.address, tokens(20))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User2 Fills Final Order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)


    // Seed Open Orders:
    // User1 Makes 10 Orders - Using JS For Loop
    for(let i = 1; i <= 10; i++) {
      transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), DAPP.address, tokens(10))
      result = await transaction.wait()

      console.log(`Made order from ${user1.address}`)

      // Wait 1 second
      await wait(1)
    }

    // User2 Makes 10 Orders - Using JS For Loop
    for(let i = 1; i <= 10; i++) {
      transaction = await exchange.connect(user2).makeOrder(DAPP.address, tokens(10), mETH.address, tokens (10 * i))
      result = await transaction.wait()

      console.log(`Made order from ${user2.address}`)

      // Wait 1 second
      await wait(1)
    }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
