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

// IMarket, 
contract Market is Ownable {

    uint256 private constant MAX = 32;

    IERC721 private _bet;
    uint8 private immutable _fee;
    address private immutable _vault;
    address private immutable _self;

    uint256 private _count; // running count of bets

    // Array of propostions
    bytes32[] private _betsIndexes;

    // mapping(uint64 => Bet) private _bets;
    uint64 private _betsIndex;

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

    constructor(address vault, uint8 fee) {
        require(vault != address(0), "Invalid address");
        _self = address(this);
        _vault = vault;
        // _bet = IERC721(erc721);
        _fee = fee;
        
        timeout = 30 days;
        min = 1 hours;
    }

    function getBetByIndex(uint256 id) external view returns (uint256, uint256, uint256, bool, address) {
        return _getBet(id);
    }

    function _getBet(uint256 index) private view returns (uint256, uint256, uint256, bool, address) {
        // bytes32 index = _betsIndexes[id];
        Bet memory bet = _bets[index];
        return (bet.amount, bet.payout, bet.payoutDate, bet.settled, bet.owner);
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

    function _getMaxPayoutForBet(uint256 amount, uint256 odds, bytes32 propositionId) private returns (uint256) {
        uint256 tlv = IVault(_vault).totalAssets();

        // uint256 totalAmountBet = _marketBetAmount[marketId][propositionID];
        
        if (tlv > amount * odds) {
            return amount * odds;
        }

        return tlv;
    }

    function punt(bytes32 nonce, bytes32 propositionId, bytes32 marketId, uint256 amount, uint256 odds, uint256 close, uint256 end, bytes calldata signature) external returns (uint256) {
        require(_vault != address(0), "Vault address not set");
        require(end > block.timestamp && block.timestamp > close, "Invalid date");
        
        bytes32 messageHash = keccak256(abi.encodePacked(nonce, propositionId, marketId, amount, odds, close, end));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        require(recoverSigner(ethSignedMessageHash, signature) == owner(), "Invalid signature");
        address underlying = IVault(_vault).getUnderlying();

        // add to the market
        // TODO:  REMOVE
        _marketTotal[marketId] += amount;

        // add underlying to the market
        uint256 payout = _getMaxPayout(amount, odds);

        IERC20(underlying).transferFrom(msg.sender, _self, amount);
        IERC20(underlying).transferFrom(_vault, _self, payout - amount);

        assert(IERC20(underlying).balanceOf(_self) >= payout);

        _bets.push(Bet(propositionId, amount, payout, end, false, msg.sender));
        _marketBets[marketId].push(_count);
        _count++;

        // should always be in sync
        assert(_betsIndexes.length == _count);

        // Mint the 721
        // uint256 tokenId = IBet(_bet).mint(msg.sender);

        // TODO: REMOVE TOTAL IN PLAY
        _totalInPlay += amount;
        _totalLiability += payout;

        emit Placed(propositionId, amount, amount * odds, msg.sender);

        return _count; // token ID
    }

    function settleMarket(bytes32 nonce, bytes32 marketId, bytes32 propositionId, bytes calldata signature) public {
        require(marketId != 0 && propositionId != 0, "Invalid ID");

        bytes32 message = keccak256(abi.encodePacked(nonce, propositionId, marketId));
        address marketOwner = recoverSigner(message, signature);
        require(marketOwner == owner(), "Invalid signature");
        
        uint256 count = _marketBets[marketId].length;
        assert(count < MAX);
        for (uint256 i = 0; i < count; i++) {
            uint256 index = _marketBets[marketId][i];

            if (!_bets[index].settled && _bets[index].propositionId == propositionId) {
                _settle(i);
            }
        }
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

    function claim(uint256 id, bytes calldata signature) external {
        bytes32 message = keccak256(abi.encodePacked(id));
        address marketOwner = recoverSigner(message, signature);
        require(marketOwner == owner(), "Invalid signature");

        _settle(id);
    }

    function _settle(uint256 id) private {
        require(_bets[id].settled == false, "Bet has already been settled");
        require(_bets[id].payoutDate < block.timestamp + _bets[id].payoutDate, "Market not closed");

        _bets[id].settled = true;
        _totalInPlay -= _bets[id].payout;

        IERC20(_vault).transferFrom(_self, _bets[id].owner, _bets[id].payout);

        emit Settled(id, _bets[id].payout, _bets[id].owner);
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
        require(_bets[id].settled == false, "Bet has already been settled");
        
        _bets[id].settled = true;
        _totalInPlay -= _bets[id].amount;

        // TODO: give sweeper a cut

        // refund the vault
        IERC20(_self).transferFrom(_self, _vault, _bets[id].payout);
    }

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

    event Placed(bytes32 propositionId, uint256 amount, uint256 payout, address indexed owner);
    event Settled(uint256 id, uint256 payout, address indexed owner);
}