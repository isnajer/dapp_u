// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply; // 1000000 * (10**decimals); // Scientific Notation - 1,000,000 x 10^18;

    // Track Balances
    mapping(address => uint256) public balanceOf;

    // Send Tokens


    // Create constructor function that takes _name argument, save value to state variable in line 7:
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }
}
