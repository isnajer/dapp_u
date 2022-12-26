const { expect } = require("chai");
const { ethers } = require("hardhat");



// Old example:
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
    let token, 
        accounts, 
        deployer

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('Dapp U Token', 'DAPP', '1000000')

        accounts = await ethers.getSigners()
        deployer = accounts[0]
    })

    describe('Deployment', () => {
        const name = 'Dapp U Token'
        const symbol = 'DAPP'
        const decimals = '18'
        const totalSupply = tokens('1000000')

    it('has correct name', async () => {
        // Read token name:
        // const name = await token.name()

        // Check that name is correct - Use chai matchers:
        // expect(name).to.equal("Dapp U Token")

        // Cleaner code - 1 line:
        expect(await token.name()).to.equal(name)
    })

    it('has correct symbol', async () => {
        // Read token symbol:
        // const symbol = await token.symbol()

        // Check that symbol is correct - Use chai matchers:
        // expect(symbol).to.equal("DAPP")

        // Cleaner code - 1 Line:
        expect(await token.symbol()).to.equal(symbol)
    })

    it('has correct decimals', async () => {
        expect(await token.decimals()).to.equal(decimals)
    })

    it('has correct total supply', async () => {
        expect(await token.totalSupply()).to.equal(totalSupply)
    })

    it('it assigns total supply to deployer', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
    })
    })

})
