// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AMZToken {
    string public name = "AMZ Token";//name & symbol are part of ERC20 implementaion, but are optional
    string public symbol = "AMZ";
    string public standard = "AMZ Token v1.0";//not the part of ERC20 implementation
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    //Approve
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public { 
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply; 
    }

    //Transfer
    function transfer(address _to, uint256 _value) public returns (bool success){
      //Exception if account does'nt have enough
    //   require(balanceOf[msg.sender] >= _value);//Stop function if condition result false
      
      balanceOf[msg.sender] -= _value;
      balanceOf[_to] += _value;

      emit Transfer(msg.sender, _to, _value);
      return true;
    }

    //Approve
    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        
        return true;
    }
}
