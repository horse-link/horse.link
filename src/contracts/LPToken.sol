// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IBurnable.sol";
import "./IMintable.sol";

contract LPToken is IMintable, IBurnable, ERC20, Ownable {

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
    }

    function mintTo(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burnFrom(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}