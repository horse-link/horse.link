// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./IERC4626.sol";

contract Registry {

    mapping(address => address) public underlying;
    address[] public vaults;

    function count() external view returns (uint256) {
        return vaults.length;
    }

    function add(address vault) external {
        address _underlying = IERC4626(vault).asset();
        require(underlying[_underlying] == address(0), "Vault already added");

        vaults.push(vault);
        underlying[_underlying] = vault; // underlying to vault
    }
}
