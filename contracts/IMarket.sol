// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

interface IMarket {
    function getTotalInplay() external view returns (uint256);
    function getInplayCount() external view returns (uint256);
    function getBet(uint256 index) external view returns (uint256, uint256, uint256, bool, address);
    function getPoolAddress() external view returns (address);
    function back(bytes32 id, uint256 amount, uint256 odds, uint256 start, uint256 end, bytes memory signature) external returns (uint256);
}