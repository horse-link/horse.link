// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

interface IMarket {
    function getTarget() external view returns (uint8);
    function getTotalInplay() external view returns (uint256);
    //function getInplayCount() external view returns (uint256);
    function getBetByIndex(uint256 index) external view returns (uint256, uint256, uint256, bool, address);
    function getOdds(int wager, int256 odds, bytes32 propositionId) external view returns (int256);
    function getVaultAddress() external view returns (address);
    function back(bytes32 nonce, bytes32 propositionId, bytes32 marketId, uint256 wager, uint256 odds, uint256 close, uint256 end, bytes calldata signature) external returns (uint256);
    function claim(uint256 id, bytes calldata signature) external;
}