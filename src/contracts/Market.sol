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
    bytes32 propositionId;
    uint256 amount;
    uint256 payout;
    uint256 payoutDate;
    bool settled;
    address owner;
}

contract Market is Ownable, IMarket {

    uint256 private constant MAX = 32;
    int256 private constant PRECESSION = 1_000;

    IERC721 private _bet;
    uint8 private immutable _fee;
    address private immutable _vault;
    address private immutable _self;
    address private immutable _oracle;

    uint256 private _count; // running count of bets

    Bet[] private _bets;

    // MarketID => amount bet
    mapping(bytes32 => uint256) private _marketTotal;

    // MarketID => Bets Indexes
    mapping(bytes32 => uint256[]) private _marketBets;

    // MarketID => PropositionID => amount bet
    mapping(bytes32 => mapping(uint16 => uint256)) private _marketBetAmount;

    // PropositionID => amount bet
    mapping(bytes32 => uint256) private _potentialPayout;

    uint256 private _totalInPlay;
    uint256 private _totalExposure;

    // Can claim after this period regardless
    uint256 public immutable timeout;
    uint256 public immutable min;

    function getFee() external view returns (uint8) {
        return _fee;
    }

    function getTotalInPlay() external view returns (uint256) {
        return _totalInPlay;
    }

    function getInPlayCount() external view returns (uint256) {
        return _count;
    }

    function getTotalExposure() external view returns (uint256) {
        return _totalExposure;
    }

    function getOracleAddress() external view returns (address) {
        return _oracle;
    }

    function getVaultAddress() external view returns (address) {
        return _vault;
    }

    function getExpiry(uint64 id) external view returns (uint256) {
        return _getExpiry(id);
    }

    function getMarketTotal(bytes32 marketId) external view returns (uint256) {
        return _marketTotal[marketId];
    }

    function _getExpiry(uint64 id) private view returns (uint256) {
        return _bets[id].payoutDate + timeout;
    }

    constructor(address vault, uint8 fee, address oracle) {
        require(vault != address(0), "Invalid address");
        _self = address(this);
        _vault = vault;
        // _bet = IERC721(erc721);
        _fee = fee;
        _oracle = oracle;
        
        timeout = 30 days;
        min = 1 hours;
    }

    // function getBetById(bytes32 id) external view returns (uint256, uint256, uint256, bool, address) {
    //     uint64 index = _betsIndexes[id];
    //     return _getBet(index);
    // }

    function getBetByIndex(uint256 index) external view returns (uint256, uint256, uint256, bool, address) {
        return _getBet(index);
    }

    function _getBet(uint256 index) private view returns (uint256, uint256, uint256, bool, address) {
        Bet memory bet = _bets[index];
        return (bet.amount, bet.payout, bet.payoutDate, bet.settled, bet.owner);
    }

    // function getBetById(bytes32 id) external view returns (uint256, uint256, uint256, bool, address) {
    //     // bytes32 index = _betsIndexes[id];
    //     // Bet memory bet = _bets[id];
    //     // return (bet.amount, bet.payout, bet.payoutDate, bet.claimed, bet.owner);
    //     return 0;
    // }

    function getOdds(int256 wager, int256 odds, bytes32 propositionId) external view returns (int256) {
        require(odds > 0, "getOdds: Invalid odds");
        require(wager > 0, "getOdds: Invalid wager");
        
        return _getOdds(wager, odds, propositionId);
    }
    
    function _getOdds(int256 wager, int256 odds, bytes32 propositionId) private view returns (int256) {
        assert(odds > 0);
        assert(wager > 0);
        int256 p = int256(IVault(_vault).totalAssets());

        if (p == 0) {
            return 0;
        }

        // f(wager) = odds - odds*(wager/pool) 

        if (_potentialPayout[propositionId] > uint256(p)) {
            return 0;
        }

        // do not include this guy in the return
        p -= int256(_potentialPayout[propositionId]);

        return odds - (odds * (wager * PRECESSION / p) / PRECESSION);
    }

    function getPotentialPayout(bytes32 propositionId, uint256 wager, uint256 odds) external view returns (uint256) {
        return _getPayout(propositionId, wager, odds);
    }

    function _getPayout(bytes32 propositionId, uint256 wager, uint256 odds) private view returns (uint256) {
        assert(odds > 0);
        assert(wager > 0);
        
        // add underlying to the market
        int256 trueOdds = _getOdds(int256(wager), int256(odds), propositionId);
        // assert(trueOdds > 0);

        return uint256(trueOdds) * wager / 1_000_000;
    }

    function back(bytes32 nonce, bytes32 propositionId, bytes32 marketId, uint256 wager, uint256 odds, uint256 close, uint256 end, bytes calldata signature) external returns (uint256) {
        require(_vault != address(0), "back: Vault address not set");
        require(end > block.timestamp && block.timestamp > close, "back: Invalid date");
        
        bytes32 messageHash = keccak256(abi.encodePacked(nonce, propositionId, marketId, wager, odds, close, end));
        // bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        // require(recoverSigner(ethSignedMessageHash, signature) == owner(), "Invalid signature");
        address underlying = IVault(_vault).asset();

        // add underlying to the market
        int256 trueOdds = _getOdds(int256(wager), int256(odds), propositionId);
        assert(trueOdds > 0);

        uint256 payout = _getPayout(propositionId, wager, odds);

        // escrow
        IERC20(underlying).transferFrom(msg.sender, _self, wager);
        IERC20(underlying).transferFrom(_vault, _self, (payout - wager));

        // assert(IERC20(underlying).balanceOf(_self) >= payout);

        // add to the market
        _marketTotal[marketId] += wager;

        _bets.push(Bet(propositionId, wager, payout, end, false, msg.sender));
        _marketBets[marketId].push(_count);
        _count++;

        // Mint the 721
        // uint256 tokenId = IBet(_bet).mint(msg.sender);

        _totalInPlay += payout;
        _totalExposure += (payout - wager);

        emit Placed(_count, propositionId, marketId, wager, payout, msg.sender);

        return _count; // token ID
    }

    function settle(uint256 index, bool result, bytes calldata signature) external {
        bytes32 message = keccak256(abi.encodePacked(index, result));
        address marketOwner = recoverSigner(message, signature);
        require(marketOwner == owner(), "settle: Invalid signature");

        _settle(index, result);
    }

    function settleMarket(bytes32 propositionId, bytes32 marketId, bytes calldata signature) external {
        bytes32 message = keccak256(abi.encodePacked(propositionId, marketId));
        address marketOwner = recoverSigner(message, signature);
        require(marketOwner == owner(), "settleMarket: Invalid signature");

        uint256 count = _marketBets[marketId].length;
        assert(count < MAX);
        for (uint256 i = 0; i < count; i++) {
            uint256 index = _marketBets[marketId][i];

            if (!_bets[index].settled) {
                if (_bets[index].propositionId == propositionId) {
                    _settle(index, true);
                } else {
                    _settle(index, false);
                }
            }
        }
    }

    function _settle(uint256 id, bool result) private {
        require(_bets[id].settled == false, "_settle: Bet has already been settled");
        require(_bets[id].payoutDate < block.timestamp + _bets[id].payoutDate, "_settle: Market not closed");

        _bets[id].settled = true;
        _totalInPlay -= _bets[id].payout;
        _totalInPlay -= 1;
        _totalExposure -= _bets[id].payout;

        address underlying = IVault(_vault).asset();

        if (result == true) {
            // Transfer the win to the punter
            IERC20(underlying).transfer(_bets[id].owner, _bets[id].payout);    
        }

        if (result == false) {
            // Transfer the proceeds to the vault
            IERC20(underlying).transfer(_vault, _bets[id].payout);
        }

        emit Settled(id, _bets[id].payout, result, _bets[id].owner);
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

    function getEthSignedMessageHash(bytes32 messageHash)
        internal
        pure
        returns (bytes32)
    {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
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

    event Placed(uint256 index, bytes32 propositionId, bytes32 marketId, uint256 amount, uint256 payout, address indexed owner);
    event Settled(uint256 id, uint256 payout, bool result, address indexed owner);
}