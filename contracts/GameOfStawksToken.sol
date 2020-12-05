// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GameOfStawksToken is ERC20 {

    address public owner;
    event Bought(uint256 amount);

    constructor(uint256 initialSupply, uint8 decimals) public ERC20("GameOfStawksToken", "GOST") {
        _mint(msg.sender, initialSupply);
        _setupDecimals(decimals);
        owner = msg.sender;
    }

    function conversion(uint256 amountToConvert) internal pure returns (uint256) {
        uint256 amountOfTokens = amountToConvert / 1000000;
        return amountOfTokens;
    }

    function buy(address to) payable public {
        uint256 amountToConvert = msg.value;
        uint256 convertedAmount = conversion(amountToConvert);
        require(convertedAmount > 0, "You need to send some Ether");
        _transfer(owner, to, convertedAmount);
        emit Bought(convertedAmount);
    }

    function earn(address to) payable public returns (bool) {
        _transfer(owner, to, 1000);
    }
}