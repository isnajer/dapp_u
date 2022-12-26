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
    mapping(address => mapping(address => uint256)) public allowance;

    // Send Tokens
    event Transfer(
        address indexed from,
        address indexed to, 
        uint256 value
    );

    // Transaction Approval
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    
    // Create constructor function that takes _name argument, save value to state variable in line 7:
    constructor(
        string memory _name, 
        string memory _symbol, 
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) 
        public
        returns (bool success)
    {
        //  Require that sender has enough tokens to spend
        require(balanceOf[msg.sender] >= _value);
        require(_to != address(0));

        // Deduct tokens from spender
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        // Credit tokens to receiver
        balanceOf[_to] = balanceOf[_to] + _value;

        // Emit event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) 
        public 
        returns(bool success) 
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

}
