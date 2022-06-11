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
    bytes32 marketId;
    uint256 amount;
    uint256 payout;
    uint256 payoutDate;
    bool claimed;
    address owner;
}

// IMarket, 
contract Market is Ownable {

    uint256 private constant MAX = 32;

    IERC721 private _bet;
    uint8 private immutable _fee;
    address private immutable _vault;
    address private immutable _self;

    bytes32[] private _betsIndexes;

    // MarketID => amount bet
    mapping(bytes32 => uint256) private _marketTotal;

    // MarketID => PropositionID => amount bet
    mapping(bytes32 => mapping(uint16 => uint256)) private _marketBetAmount;

    mapping(uint64 => Bet) private _bets;
    uint64 private _betsIndex;

    uint256 private _totalInPlay;
    uint256 private _totalLiability;

    // Can claim after this period regardless
    uint256 public immutable timeout;
    uint256 public immutable min;

    function getTarget() public view returns (uint8) {
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

    function getExpiry(uint64 id) external view returns (uint256) {
        return _getExpiry(id);
    }

    function _getExpiry(uint64 id) private view returns (uint256) {
        return _bets[id].payoutDate + 30 days;
    }

    constructor(address vault, address erc721, uint8 fee) {
        require(vault != address(0), "Pool address cannot be 0");
        _self = address(this);
        _vault = vault;
        // _bet = IERC721(erc721);
        _fee = fee;
        
        timeout = 30 days;
        min = 1 hours;
    }

    function getBet(uint64 id) external view returns (uint256, uint256, uint256, bool, address) {
        return _getBet(id);
    }

    function _getBet(uint64 id) private view returns (uint256, uint256, uint256, bool, address) {
        // bytes32 index = _betsIndexes[id];
        Bet memory bet = _bets[id];
        return (bet.amount, bet.payout, bet.payoutDate, bet.claimed, bet.owner);
    }

    // function getBetById(bytes32 id) external view returns (uint256, uint256, uint256, bool, address) {
    //     // bytes32 index = _betsIndexes[id];
    //     // Bet memory bet = _bets[id];
    //     // return (bet.amount, bet.payout, bet.payoutDate, bet.claimed, bet.owner);
    //     return 0;
    // }

    function getMaxPayout(uint256 amount, uint256 odds) external returns (uint256) {
        return _getMaxPayout(amount, odds);
    }

    function _getMaxPayout(uint256 amount, uint256 odds) private returns (uint256) {
        uint256 totalAssets = IVault(_vault).totalAssets();
        if (totalAssets > amount * odds) {
            return amount * odds;
        }
        
        return totalAssets;
    }

    function _getMaxPayoutForBet(uint256 amount, uint256 odds, bytes32 marketId, uint16 propositionId) private returns (uint256) {
        uint256 totalAssets = IVault(_vault).totalAssets();

        // uint256 totalAmountBet = _marketBetAmount[marketId][propositionID];
        
        if (totalAssets > amount * odds) {
            return amount * odds;
        }

        return totalAssets;
    }

    function back(bytes32 id, bytes32 nonce, bytes32 marketId, uint256 amount, uint256 odds, uint256 start, uint256 end, bytes calldata signature) external returns (uint256) {
        require(_vault != address(0), "Vault address not set");
        require(start > 0, "Start must be greater than 0");
        require(start < block.timestamp && end > block.timestamp, "Betting start time has passed");
        
        bytes32 message = keccak256(abi.encodePacked(nonce, marketId, id, amount, odds, start, end));
        address marketOwner = recoverSigner(message, signature);
        require(marketOwner == owner(), "Invalid signature");

        address underlying = IVault(_vault).getUnderlying();

        // add to the market
        _marketTotal[marketId] = _marketTotal[marketId] += amount;

        // add underlying to the market
        uint256 potentialPayout = _getMaxPayout(amount, odds);
        assert(potentialPayout > amount);

        IERC20(underlying).transferFrom(msg.sender, _self, amount);
        IERC20(underlying).transferFrom(_vault, _self, potentialPayout - amount);

        assert(IERC20(underlying).balanceOf(_self) >= potentialPayout);

        // _bets[marketId][id] = Bet(amount, amount * odds, end, false, msg.sender);
        _betsIndexes.push(id);


        // _marketBetAmount[marketId][proposition] += amount; // potentialPayout;


        // _bets[id] = Bet(amount, amount * odds, end, false, msg.sender);
        // _betsIndexes.push(id);

        // Mint the 721
        // uint256 tokenId = IBet(_bet).mint(msg.sender);

        // TODO: REMOVE TOTAL IN PLAY
        _totalInPlay += amount;
        _totalLiability += (amount * odds);

        emit Placed(id, amount, amount * odds, msg.sender);

        return _betsIndexes.length; // token ID
    }

    // function claim(bytes32 id, bytes calldata signature) external {
    //     bytes32 message = keccak256(abi.encodePacked(id));
    //     address marketOwner = recoverSigner(message, signature);
    //     require(marketOwner == owner(), "Invalid signature");

    //     require(_bets[id].claimed == false, "Bet has already been claimed");
    //     require(_bets[id].payoutDate < block.timestamp + _bets[id].payoutDate, "Market not closed");

    //     _bets[id].claimed = true;
    //     _totalInPlay -= _bets[id].amount;

    //     IERC20(_vault).transferFrom(_self, _bets[id].owner, _bets[id].payout);

    //     emit Claimed(id, _bets[id].payout, _bets[id].owner);
    // }

    function claim(uint64 id, bytes calldata signature) external {
        bytes32 message = keccak256(abi.encodePacked(id));
        address marketOwner = recoverSigner(message, signature);
        require(marketOwner == owner(), "Invalid signature");

        require(_bets[id].claimed == false, "Bet has already been claimed");
        require(_bets[id].payoutDate < block.timestamp + _bets[id].payoutDate, "Market not closed");

        _bets[id].claimed = true;
        _totalInPlay -= _bets[id].amount;

        IERC20(_vault).transferFrom(_self, _bets[id].owner, _bets[id].payout);

        emit Claimed(id, _bets[id].payout, _bets[id].owner);
    }

    // function sweep(bytes32 id) external {
    //     require(_getExpiry(id) > block.timestamp, "Bet has not expired");
    //     require(_bets[id].claimed == false, "Bet has already been claimed");
        
    //     _bets[id].claimed = true;
    //     _totalInPlay -= _bets[id].amount;

    //     // TODO: give sweeper a cut

    //     // refund the vault
    //     IERC20(_self).transferFrom(_self, _vault, _bets[id].payout);
    // }

    function sweep(uint64 id) external {
        require(_getExpiry(id) > block.timestamp, "Bet has not expired");
        require(_bets[id].claimed == false, "Bet has already been claimed");
        
        _bets[id].claimed = true;
        _totalInPlay -= _bets[id].amount;

        // TODO: give sweeper a cut

        // refund the vault
        IERC20(_self).transferFrom(_self, _vault, _bets[id].payout);
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

    event Claimed(uint64 id, uint256 payout, address indexed owner);
    event Placed(bytes32 id, uint256 amount, uint256 payout, address indexed owner);
}