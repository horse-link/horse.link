// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./IMarket.sol";
import "./IVault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Registry {

    mapping(address => address) private _underlying;
    mapping(address => address) private _markets;
    address[] public markets;
    address[] public vaults;

    address private immutable _token;

    function marketCount() external view returns (uint256) {
        return markets.length;
    }

    function vaultCount() external view returns (uint256) {
        return vaults.length;
    }

    constructor(address token) {
        _token = token;
    }

    function addVault(address vault) external {
        address underlying = IVault(vault).asset();
        require(_underlying[underlying] == address(0), "addVault: Vault already added");

        vaults.push(vault);
        _underlying[underlying] = vault; // underlying to vault

        emit VaultAdded(vault);
    }

    function addMarket(address market) external {
        address vault = IMarket(market).getVaultAddress();
        require(_markets[vault] == address(0), "addMarket: Market already added");

        _markets[vault] = market; // vault to market
        markets.push(market);
        emit MarketAdded(market);
    }

    modifier onlyTokenHolders() {
        require(IERC20(_token).balanceOf(msg.sender) > 0, "Not a token holder");
        _;
    }

    event MarketAdded(address indexed market);
    event VaultAdded(address indexed vault);
}
