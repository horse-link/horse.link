// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IBurnable.sol";
import "./IMintable.sol";

contract HorseLink is IMintable, ERC20, Ownable {

    constructor() ERC20("Horse Link", "HL") {
    }

    function mintTo(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}