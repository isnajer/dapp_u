// Use this instead of "import from":
const {ethers} = require("hardhat");


async function main() {
    // Fetch contract to deploy:
    // Use ethers library.
    // Use function "getContractFactory" -- lets us get all necessary info from artifacts folder.
    const Token = await ethers.getContractFactory("Token")

    // Deploy contract
    const token = await Token.deploy()
    await token.deployed()
    // Put var inside a string --> (`${evaluation}`)
    console.log(`Token Deployed to: ${token.address}`)
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});