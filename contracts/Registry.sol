// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./IMarket.sol";
import "./IVault.sol";

contract Registry {

    mapping(address => address) public underlying;
    address[] public vaults;
    address[] public markets;

    function count() external view returns (uint256) {
        return vaults.length;
    }

    function addVault(address vault) external {
        address _underlying = IVault(vault).asset();
        require(underlying[_underlying] == address(0), "Vault already added");

        vaults.push(vault);
        underlying[_underlying] = vault; // underlying to vault
    }

    function addMarket(address market) external {
        markets.push(market);
    }
}
