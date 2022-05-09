// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import { IBet } from "./IBet.sol";
import "./IVault.sol";
import "./IMarket.sol";

// Put these in the ERC721 contract
struct Bet {
    // bytes32 id;
    uint256 amount;
    uint256 payout;
    uint256 payoutDate;
    uint256 expires;  
    bool claimed;
    address owner;
}

contract Market is IMarket, Ownable {

    address private immutable _bet;
    uint256 private immutable _fee;
    address private immutable _vault;

    // mapping(address => Bet[]) private _bets;

    bytes32[] private _betsIndexes;
    mapping(bytes32 => Bet) private _bets;

    uint256 private _totalInPlay;
    uint256 private _totalLiability;

    // Oracle if bet is not claimed
    // address public immutable oracle;

    // Can claim after this period regardless
    uint256 public immutable timeout;
    uint256 public immutable min;

    function getTarget() public view returns (uint256) {
        return _fee;
    }

    function getTotalInplay() public view returns (uint256) {
        return _totalInPlay;
    }

    function getInplayCount() public view returns (uint256) {
        return _betsIndexes.length;
    }

    function getVaultAddress() external view returns (address) {
        return _vault;
    }

    constructor(address vault, address erc721, uint256 fee) {
        require(vault != address(0), "Pool address cannot be 0");
        _vault = vault;
        _bet = erc721;
        _fee = fee;
        
        timeout = 30 days;
        min = 1 hours;
    }

    function getBet(uint256 index) external view returns (uint256, uint256, uint256, bool, address) {
        bytes32 id = _betsIndexes[index];
        Bet memory bet = _bets[id];
        return (bet.amount, bet.payout, bet.payoutDate, bet.claimed, bet.owner);
    }

    function back(bytes32 id, uint256 amount, uint256 odds, uint256 start, uint256 end, bytes calldata signature) external returns (uint256) {
        require(_vault != address(0), "Vault address not set");
        require(start > 0, "Start must be greater than 0");
        require(start < block.timestamp, "Betting start time has passed");
        
        bytes32 message = keccak256(abi.encodePacked(id, amount, odds, start, end));
        address marketOwner = recoverSigner(message, signature);
        require(marketOwner == owner(), "Invalid signature");

        address underlying = IVault(_vault).getUnderlying();

        IERC20(underlying).transferFrom(msg.sender, address(this), amount);
        // _bets.push(Bet(id, amount, amount * odds, start, false, owner));
        _bets[id] = Bet(amount, amount * odds, start, end + timeout, false, msg.sender);

        // Mint the 721
        uint256 tokenId = IBet(_bet).mint(msg.sender);

        _totalInPlay += amount;
        _totalLiability += (amount * odds);

        emit Placed(id, amount, amount * odds, msg.sender);

        return tokenId; // token ID
    }

    function claim(bytes32 id, bytes calldata signature) external {
        bytes32 message = keccak256(abi.encodePacked(id));
        address marketOwner = recoverSigner(message, signature);
        require(marketOwner == owner(), "Invalid signature");

        require(_bets[id].claimed == false, "Bet has already been claimed");
        require(_bets[id].payoutDate < block.timestamp + _bets[id].payoutDate, "Market not closed");

        _bets[id].claimed = true;
        _totalInPlay -= _bets[id].amount;

        IERC20(_vault).transferFrom(address(this), _bets[id].owner, _bets[id].payout);

        emit Claimed(id, _bets[id].payout, _bets[id].owner);
    }

    function getExpiry(bytes32 id) external view returns (uint256) {
        return _getExpiry(id);
    }

    function _getExpiry(bytes32 id) private view returns (uint256) {
        return _bets[id].expires;
    }

    function sweep(bytes32 id) external {
        require(_getExpiry(id) > block.timestamp, "Bet has not expired");
        require(_bets[id].claimed == false, "Bet has already been claimed");
        _bets[id].claimed = true;
        _totalInPlay -= _bets[id].amount;
    }

    function recoverSigner(bytes32 message, bytes memory signature)
        private
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
        private
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

    event Claimed(bytes32 id, uint256 payout, address indexed owner);
    event Placed(bytes32 id, uint256 amount, uint256 payout, address indexed owner);
}