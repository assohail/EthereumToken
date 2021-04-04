// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AMZToken {
    string public name = "AMZ Token";//name & symbol are part of ERC20 implementaion, but are optional
    string public symbol = "AMZ";
    // string public standard = "AMZ Token v1.0";//not the part of ERC20 implementation
    
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    constructor(uint256 _initialSupply) public { 
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply; 
    }
}
