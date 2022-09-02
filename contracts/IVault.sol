// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVault {
    function asset() external view returns (address assetTokenAddress);
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function getPerformance() external view returns (uint256);
    function totalAssets() external view returns (uint256);
    function withdraw() external;

    event Deposit(address indexed who, uint256 value);
    event Withdraw(address indexed who, uint256 value);
}