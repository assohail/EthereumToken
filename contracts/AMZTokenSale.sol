// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./AMZToken.sol";

contract AMZTokenSale {
    //We dont want to expose address of admin to public
    address payable private admin;
    AMZToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor (AMZToken _tokenContract, uint256 _tokenPrice) public { 
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    // multiply
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that the value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice), 'Value Error');
        // Require that the contarct has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, 'Balance Error 1');
        // Require that a transfer is successful
        // require(tokenContract.transfer(msg.sender, _numberOfTokens), 'Balance Error 2');
        // Keep track of tokenSold
        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    // End Token Sale
    function endSale() public {
        // Require admin
        require(msg.sender == admin);
        // Transfer remaining tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // Destroy contract
        selfdestruct(admin);
    }
}