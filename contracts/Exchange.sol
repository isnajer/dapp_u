// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    // Account that receives exchange fees
    address public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount= _feeAccount;
        feePercent = _feePercent;
    }


    
    // ----- DEPOSIT & WITHDRAW TOKEN -----

    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        // ^ 'require' wrapper adds extra layer of protection at the exchange level
        
        // Updates user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;

        // Emit an event (from line 13)
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

    }
    
    // Check Balances (wrapper function that checks if you have a mapping - bonus)
    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }


}
