// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVault {
    function asset() external view returns (address);
    function getPerformance() external returns (uint256);
    function totalAssets() external returns (uint256);
    // // function totalReserves() external returns (uint256);
    // function supply(uint256 value) external;
    // function exit() external;

    event Exited(address indexed who, uint256 value);
    event Supplied(address indexed owner, uint256 value);
}