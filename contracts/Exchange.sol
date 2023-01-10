// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    // Account that receives exchange fees
    address public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount; // counterCache = total num of orders that have been created in this smart contract itself
    mapping(uint256 => bool) public orderCancelled; // boolean
    mapping(uint256 => bool) public orderFilled;


    event Deposit(
        address token, 
        address user, 
        uint256 amount, 
        uint256 balance
    );

    event Withdraw(
        address token,
        address user, 
        uint256 amount, 
        uint256 balance
    );

    event Order(
        uint256 id,      
        address user,     
        address tokenGet,   
        uint256 amountGet,  
        address tokenGive,  
        uint256 amountGive, 
        uint256 timestamp 
    );

    event Cancel(
        uint256 id,      
        address user,     
        address tokenGet,   
        uint256 amountGet,  
        address tokenGive,  
        uint256 amountGive, 
        uint256 timestamp 
    );

    event Trade(
        uint256 id,      
        address user,     
        address tokenGet,   
        uint256 amountGet,  
        address tokenGive,  
        uint256 amountGive,
        address creator, 
        uint256 timestamp 
    );


    // Order Struct (way to create your own arbitrary data type inside Solidity)
    // A way to model the order
    struct _Order {
        // Attributes of an order
        uint256 id;         // Unique identifier for order
        address user;       // User who made order
        address tokenGet;   // Address of the token they receive
        uint256 amountGet;  // Amount they receive
        address tokenGive;  // Address of the token they give
        uint256 amountGive; // Amount they give
        uint256 timestamp;  // When order was created

    }

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount= _feeAccount;
        feePercent = _feePercent;
    }


    
    // ----- DEPOSIT & WITHDRAW TOKEN -----

    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to (from user) exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        // ^ 'require' wrapper adds extra layer of protection at the exchange level
        
        // Update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;

        // Emit an event (from line 13)
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

    }

    // Withdraw Tokens
    function withdrawToken(address _token, uint256 _amount) public {

        // Ensure user has enought tokens to withdraw
        require(tokens[_token][msg.sender] >= _amount);
        
        // Transfer tokens to user
        Token(_token).transfer(msg.sender, _amount);

        // Update user balance (telling exchange how many tokens exist on that platform - reference)
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

        // Emit an event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
        
    }
    
    // Check Balances (wrapper function that checks if you have a mapping - bonus)
    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }


    // ----- MAKE & CANCEL ORDERS -----

    // Make Order

    // Token Give, Token Get
    
    function makeOrder(
        address _tokenGet, 
        uint256 _amountGet, 
        address _tokenGive, 
        uint256 _amountGive
    ) public {

        // Require Token Balance - Prevent orders it tokens aren't on exchange
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

        // Instantiate a new order
        orderCount ++;
        orders[orderCount] = _Order(
            orderCount, // id = '1, 2, 3'
            msg.sender, // user = '0x0....abc123'
            _tokenGet, // tokenGet (the token user wants to receive - which token, and how much?)
            _amountGet, // amountGet
            _tokenGive, // tokenGive (the token user wants to spend - which token, and how much?)
            _amountGive, // amountGive
            block.timestamp // timestamp of current block in EpochTime format (time in seconds since 01/01/1970...)
        );    

        // Emit New Order Event (user same arguments inside create order ^)
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    // Cancel Order
    function cancelOrder(uint256 _id) public {
        // Fetch order
        _Order storage _order = orders[_id];

        // Ensure caller of the function is owner of order
        require(address(_order.user) == msg.sender);

        // Order must exist
        require(_order.id == _id);

        // Cancel the order
        orderCancelled[_id] = true;

        // Emit event
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }


    // ----- EXECUTING ORDERS -----
    function fillOrder(uint256 _id) public {
        // 1. Must be valid orderId
        require(_id > 0 && _id <= orderCount, "Order does not exist");

        // 2. Order can't be filled
        require(!orderFilled[_id]);

        // 3. Order can't be cancelled
        require(!orderCancelled[_id]); // ! = bang/is not

        // Fetch order
        _Order storage _order = orders[_id];

        // Execute the trade
        _trade(
            _order.id, 
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive 
        );

        // Mark order as filled
        orderFilled[_order.id] = true;
    }

    function _trade(
        uint256 _orderId, 
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        // Fee is paid by user who filled the oerder (msg.sender)
        // Fee is deducted from _amountGet
        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        // Execute trade
        // msg.sender is the user who filled the order, while _user is who created the order
        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender] - (_amountGet + _feeAmount);  // takes token away from user2 balance + fee amount 10%
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;   // adds token to user1 balance

        // Charge fees
        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] + _feeAmount;

        tokens[_tokenGive][_user] = tokens[_tokenGive][_user] - _amountGive;    // takes token away from user2 balance
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] + _amountGive;   // adds token to user1 balance
        
        // Emit trade event
        emit Trade(
            _orderId, 
            msg.sender, 
            _tokenGet, 
            _amountGet, 
            _tokenGive, 
            _amountGive,
            _user, 
            block.timestamp);
    }


    // ----- SEED EXCHANGE -----
    





}
