// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../IMintable.sol";
import "../IBurnable.sol";

struct Reward {
    uint256 balance;
    uint256 start;
}

contract Pool is Ownable {
    // Rewards
    mapping(address => Reward) private _rewards;
    uint256 private constant REWARDS_PER_BLOCK;

    // Bets
    uint256 private _supplied; // total added to the contract from LPs
    uint256 private _inPlay;

    // Balance of LPs
    mapping(address => uint256) private _lps;

    // address private immutable _lpToken;
    // address private immutable _rewardsToken;
    address private immutable _underlying;
    address private immutable _self;

    // uint256 private constant PRECISSION = 1_000;

    function getUnderlying() external view returns (address) {
        return _underlying;
    }

    function getUnderlyingBalance() public view returns (uint256) {
        return IERC20(_underlying).balanceOf(address(this));
    }

    function getPoolPerformance() external returns (int256) {
        return _getPoolPerformance();
    }

    function _getPoolPerformance() private returns (uint256) {
        uint256 underlyingBalance = IERC20(_underlying).balanceOf(address(this));
        return _supplied * 1e6 / underlyingBalance * 1e6;
    }

    function getLPTokenAddress() external view returns (address) {
        return _lpToken;
    }

    function totalSupplied() external view returns (uint256) {
        return _supplied;
    }

    function totalReserves() external view returns (uint256) {
        return _totalReserves();
    }

    function _totalReserves() private returns (uint256) {
        return _supplied + _inPlay;
    }

    function supplied(address who) public returns (uint256) {
        return _lps[who];
    }

    function balanceOf(address who) external view returns (int256) {
        return _balanceOf(who) / _totalReserves();
    }

    constructor(address lpToken, address underlying) {
        require(token != address(0) && underlying != address(0), "Invalid address");
        _lpToken = lpToken;
        _underlying = underlying;
        _self = address(this);
    }

    // Tokens added to the pool
    function supply(uint256 amount) external {
        require(amount > 0, "Value must be greater than 0");

        // IERC20(_token).transferFrom(msg.sender, _self, amount);
        // IMintable(_lpToken).mintTo(msg.sender, amount);

        _supplied += amount;

        emit Supplied(msg.sender, amount);
    }

    // Exit your position
    function exit(uint256 amount) external {
        require(amount > IERC20(_lpToken).balanceOf(msg.sender), "You must have a balance to exit");

        // IBurnable(_lpToken).burnFrom(msg.sender, amount);
        _supplied -= amount;

        emit Exited(msg.sender, amount);
    }

    event Exited(address indexed who, uint256 value);
    event Supplied(address indexed owner, uint256 value);
}