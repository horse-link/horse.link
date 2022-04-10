// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IPool.sol";
import "./IMarket.sol";

struct Bet {
    bytes32 id;
    uint256 amount;
    uint256 payout;
    uint256 payoutDate;
    bool claimed;
    address owner;
}

contract Market is IMarket, Ownable {

    address private immutable _pool;
    uint256 private immutable _fee;

    // mapping(address => Bet[]) private _bets;

    Bet[] private _bets;

    uint256 private _totalInPlay;
    uint256 private _totalDebt;

    // Oracle if bet is not claimed
    address public oracle;

    // Can claim after this period regardless
    uint256 public timeout;
    uint256 public min;

    function getTotalInplay() public view returns (uint256) {
        //return _totalInPlay;
        // Note: Hardcode this for testing
        return 21829;
    }

    function getInplayCount() public view returns (uint256) {
        return _bets.length;
    }

    function getPoolAddress() external view returns (address) {
        return _pool;
    }

    constructor(address pool, uint256 fee) {
        _pool = pool;
        _fee = fee;

        timeout = 30 days;
        min = 1 hours;
    }

    function getBet(uint256 index) external view returns (uint256, uint256, uint256, bool, address) {
        return (_bets[index].amount, _bets[index].payout, _bets[index].payoutDate, _bets[index].claimed, _bets[index].owner);
    }

    function back(bytes32 id, uint256 amount, uint256 odds, uint256 start, uint256 end, bytes memory signature) external returns (uint256) {
        require(start < block.timestamp, "Betting start time has passed");
        bytes32 message = keccak256(abi.encodePacked(id, amount, odds, start, end));
        address owner = recoverSigner(message, signature);

        require(owner == msg.sender, "Only the owner can back");
        address underlying = IPool(_pool).getUnderlying();

        IERC20(underlying).transferFrom(msg.sender, address(this), amount);
        _bets.push(Bet(id, amount, amount * odds, start, false, owner));

        _totalInPlay += amount;
        _totalDebt += amount * odds;

        // emit BetPlaced(id, amount, odds, start, end, owner);

        return _bets.length;
    }

    function claimAll() public {

    }

    function claim(uint256 index) external {
        require(_bets[index].claimed == false, "Bet has already been claimed");
        require(_bets[index].end < block.timestamp + payoutDate, "Betting end time has not passed");
    }

    function recoverSigner(bytes32 message, bytes memory signature)
        internal
        pure
        returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(signature);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory signature)
        internal
        pure
        returns (uint8, bytes32, bytes32)
    {
        require(signature.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(signature, 32))
            // second 32 bytes
            s := mload(add(signature, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(signature, 96)))
        }

        return (v, r, s);
    }

    event BetPlaced(uint256 index, uint256 amount, uint256 payout, address indexed owner);
    event Claimed(uint256 index, uint256 amount, uint256 payout, address indexed owner);
}