const { expect } = require("chai");
const { ethers } = require("hardhat");


const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Exchange', () => {
    let deployer, feeAccount, exchange

    const feePercent = 10

    beforeEach(async () => {
        const Exchange = await ethers.getContractFactory('Exchange')
        const Token = await ethers.getContractFactory('Token')

        token1 = await Token.deploy('Dapp U Token', 'DAPP', '1000000')

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]
        user1 = accounts[2]

        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
        await transaction.wait()
        exchange = await Exchange.deploy(feeAccount.address, feePercent)
        
    })

    describe('Deployment', () => {
  
        it('tracks the fee account', async () => {
            expect(await exchange.feeAccount()).to.equal(feeAccount.address)
        })

        it('tracks the fee percent', async () => {
            expect(await exchange.feePercent()).to.equal(feePercent)
        })
    })

    describe('Depositing Tokens', () => {
        let transaction, result
        let amount = tokens(10)

        beforeEach(async () => {
            // Approve Token
            transaction = await token1.connect(user1).approve(exchange.address, amount)
            result = await transaction.wait()

            // Deposit token
            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait()
        })

        describe('Success', () => {
            it('tracks the token deposit', async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
            })
        })

        describe('Failure', () => {

        })
    })

})
