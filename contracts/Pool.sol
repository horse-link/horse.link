// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../IMintable.sol";
import "../IBurnable.sol";
import "./IMarket.sol";

struct Reward {
    uint256 balance;
    uint256 start;
}

contract Pool is Ownable {
    // Rewards
    mapping(address => Reward) private _rewards;
    uint256 private immutable REWARDS_PER_BLOCK;

    // Bets
    address private _market;

    // Liquidity
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
        // If no market is set, return 100%
        if (_market == address(0)) {
            return 100;
        }

        // Get the total inplay
        uint256 totalInPlay = IMarket(_market).getTotalInplay();

        // Market not set
        uint256 underlyingBalance = IERC20(_underlying).balanceOf(address(this));
        return (underlyingBalance - totalInPlay) / underlyingBalance * 100;
    }

    function getLPBalance(address who)  external view returns (uint256) {
        return _lps[who];
    }

    function getLPTokenAddress() external view returns (address) {
        return _lpToken;
    }

    function totalSupplied() external view returns (uint256) {
        return IERC20(_underlying).balanceOf(address(this));
    }

    function totalReserves() external view returns (int256) {
        return _totalReserves();
    }

    function _totalReserves() private returns (int256) {
        uint256 totalInPlay = IMarket(_market).getTotalInplay();
        return IERC20(_underlying).balanceOf(address(this)) - totalInPlay;
    }

    function balanceOf(address who) external view returns (int256) {
        return _balanceOf(who) / _totalReserves();
    }

    function quote(uint256 amount) external view returns (uint256) {
        // 
        return amount * _fee / 1e6;
    }

    constructor(address lpToken, address underlying) {
        require(token != address(0) && underlying != address(0), "Invalid address");
        _lpToken = lpToken;
        _underlying = underlying;

        _self = address(this);

        string name = IERC20(lpToken).name() + "-" + IERC20(underlying).name();
        string symbol = IERC20(lpToken).symbol() + "-" + IERC20(underlying).symbol();

        // deploy ERC20 contract
    }

    function supply(uint256 amount) external onlyMarket {
        // IERC20(_underlying).transfer(_market, amount);

        // add underlying to escrow
    }

    // Tokens added to the pool
    function stake(uint256 amount) external {
        require(amount > 0, "Value must be greater than 0");

        IERC20(_underlying).transferFrom(msg.sender, _self, amount);
        _totalSupplied += amount;
        _lps[msg.sender] += amount;

        // just update the contract for now and not mint
        // IMintable(_lpToken).mintTo(msg.sender, amount);

        emit Supplied(msg.sender, amount);
    }

    // Exit your position
    function exit(uint256 amount) external {
        // require(amount > IERC20(_lpToken).balanceOf(msg.sender), "You must have a balance to exit");

        uint256 truePosition = _lps[msg.sender];

        // IBurnable(_lpToken).burnFrom(msg.sender, amount);
        _totalSupplied -= amount;

        emit Exited(msg.sender, amount);
    }

    modifier onlyMarket() {
        require(_market != address(0), "Market not set");
        require(msg.sender == _market, "Only the market can call this function");
        _;
    }

    event Exited(address indexed who, uint256 value);
    event Supplied(address indexed owner, uint256 value);
}