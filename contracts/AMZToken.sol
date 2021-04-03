// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AMZToken {
    // Constructor
    // Set the total number of tokens
    // Read the total number of tokens
    uint256 public totalSupply;
    
    constructor() public { totalSupply = 1000000; }
}