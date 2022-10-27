// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./IMarket.sol";
import "./IVault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Registry {

    address[] public markets;
    address[] public vaults;

    mapping(address => address) private _underlying;
    mapping(address => address) private _markets;

    address immutable private _owner;
    address immutable private _token;
    uint256 private _threshold;

    function marketCount() external view returns (uint256) {
        return markets.length;
    }

    function vaultCount() external view returns (uint256) {
        return vaults.length;
    }

    constructor(address token) {
        _owner = msg.sender;
        _token = token;
    }

    function addVault(address vault) external {
        address underlying = IVault(vault).asset();
        require(_underlying[underlying] == address(0), "addVault: Vault with this underlying token already added");

        vaults.push(vault);
        _underlying[underlying] = vault; // underlying to vault

        emit VaultAdded(vault);
    }

    function addMarket(address market) external {
        require(_markets[market] == address(0), "addMarket: Market already added");
        markets.push(market);
        emit MarketAdded(market);
    }

    function setThreshold(uint256 threshold) external {
        _threshold = threshold;
    }

    modifier onlyTokenHolders() {
        require(IERC20(_token).balanceOf(msg.sender) >= _threshold, "onlyTokenHolders: Does not hold enough tokens");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "onlyOwner: Not contract owner");
        _;
    }

    event MarketAdded(address indexed market);
    event VaultAdded(address indexed vault);
}
