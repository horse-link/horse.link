// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IBet.sol";

contract Bet is IBet, ERC721 {

    address public immutable _owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("HorseLink", "HB") {
        _owner = msg.sender;
    }

    function mint(address to) public returns (uint256) {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(to, id);
        return id;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "ERC721: only owner allowed");
        _;
    }
}
