// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    // Account that receives exchange fees
    address public feeAccount;
    uint256 public feePercent;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount= _feeAccount;
        feePercent = _feePercent;
    }

    // Deposit Tokens
    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange
        Token(_token).transferFrom(msg.sender, address(this), _amount);
        
        // Update balance
        // Emit an event
    }
    // Check Balances

}
