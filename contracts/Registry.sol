// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./IMarket.sol";
import "./IVault.sol";

contract Registry {

    mapping(address => address) public underlying;
    address[] public markets;
    address[] public vaults;

    function marketCount() external view returns (uint256) {
        return markets.length;
    }

    function vaultCount() external view returns (uint256) {
        return vaults.length;
    }

    function addVault(address vault) external {
        address _underlying = IVault(vault).asset();
        require(underlying[_underlying] == address(0), "Vault already added");

        vaults.push(vault);
        underlying[_underlying] = vault; // underlying to vault

        emit VaultAdded(vault);
    }

    function addMarket(address market) external {
        markets.push(market);
        emit MarketAdded(market);
    }

    event MarketAdded(address indexed market);
    event VaultAdded(address indexed vault);
}
