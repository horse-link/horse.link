// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IBurnable.sol";
import "./IMintable.sol";
import "./IMarket.sol";

struct Reward {
    uint256 balance;
    uint256 start;
}

contract Pool is Ownable {
    // Rewards
    // mapping(address => Reward) private _rewards;
    // uint256 private constant REWARDS_PER_BLOCK;

    // LP
    // Deposits of LPs
    mapping(address => uint256) private _lps;
    uint256 private _supplied; // total added to the contract from LPs

    address private _lpToken;

    // address private immutable _rewardsToken;
    address private immutable _underlying;
    address private immutable _self;

    uint256 private constant PRECISSION = 1_000;
    address private _market;

    function getMarket() external view returns (address) {
        assert(_market != address(0));
        return _market;
    }

    function setMarket(address market) public onlyOwner() {
        require(_market != address(0), "Market already set");
        _market = market;
    }

    function asset() external view returns (address assetTokenAddress) {
        return _underlying;
    }

    function totalAssets() public view returns (uint256) {
        return IERC20(_underlying).balanceOf(address(this));
    }

    function getPoolPerformance() external view returns (uint256) {
        return _getPoolPerformance();
    }

    function _getPoolPerformance() private view returns (uint256) {
        uint256 underlyingBalance = IERC20(_underlying).balanceOf(address(this));

        if (underlyingBalance > 0)
            return _totalAssets() * PRECISSION / underlyingBalance;

        return 0;
    }

    function getLPTokenAddress() external view returns (address) {
        return _lpToken;
    }

    function setLPToken(address token) public onlyOwner() {
        require(_lpToken == address(0), "LP token already set");
        _lpToken = token;
    }

    function getInPlay() external view returns (uint256) {
        return _getInPlay();
    }

    function _getInPlay() private view returns (uint256) {
        return IMarket(_market).getTotalInplay();
    }

    // function totalSupplied() external view returns (uint256) {
    //     return IERC20(_underlying).balanceOf(address(this));
    // }

    function totalReserves() external view returns (uint256) {
        return _totalAssets();
    }

    function _totalAssets() private view returns (uint256) {
        uint256 underlyingBalance = IERC20(_underlying).balanceOf(address(this));
        return underlyingBalance - _getInPlay();
    }

    function deposited(address who) public view returns (uint256) {
        return _lps[who];
    }

    function balanceOf(address who) external view returns (uint256) {
        return _balanceOf(who);
    }

    function _balanceOf(address who) private view returns (uint256) {
        // calculate the portion of the pool that is in play
        return _lps[who] / (_lps[who] / _totalReserves());
    }

    constructor(address underlying) {
        // todo: create 2 on xxx-HL
        // require(lpToken != address(0) && underlying != address(0), "Invalid address");
        // _lpToken = lpToken;
        _underlying = underlying;

        _self = address(this);

        // TODO: MINT CONTRACT ON DEPLOYMENT
        // string name = IERC20(_underlying).name() + "-" + IERC20(underlying).name();
        // string symbol = IERC20(_underlying).symbol() + "-" + IERC20(underlying).symbol();

        // deploy ERC20 contract
    }

    function previewDeposit(uint256 amount) external view returns (uint256 shares) {
        shares = _lps[msg.sender] + amount;
    }

    // Add underlying tokens to the pool
    function deposit(uint256 assets) external returns (uint256 shares) {
        require(assets > 0, "Value must be greater than 0");

        IERC20(_underlying).transferFrom(msg.sender, _self, assets);
        // IMintable(_lpToken).mintTo(msg.sender, amount);

        _lps[msg.sender] += assets;
        _supplied += assets;

        emit Supplied(msg.sender, assets);
        shares = _lps[msg.sender];
    }

    function maxWithdraw(address owner) external view returns (uint256 maxAssets) {
        maxAssets = _lps[owner];
    }

    function previewWithdraw(uint256 assets) external view returns (uint256 shares) {
        shares = _quote(assets);
    }

    function _quote(uint256 assets) private view returns (uint256) {
        uint256 underlyingBalance = IERC20(_underlying).balanceOf(address(this));
        uint256 inPlay = _getInPlay();

        return assets * underlyingBalance / (underlyingBalance + inPlay);
    }

    // Exit your position
    function withdraw() external {
        uint256 balance = _balanceOf(msg.sender);
        require(balance > 0, "You have no position to exit");

        uint256 amount = _quote(balance);

        _lps[msg.sender] = 0;
        IERC20(_underlying).transfer(msg.sender, amount);
        IBurnable(_lpToken).burnFrom(msg.sender, balance);

        emit Exited(msg.sender, balance);
    }

    modifier onlyMarket() {
        require(_market != address(0), "Market not set");
        require(msg.sender == _market, "Only the market can call this function");
        _;
    }

    event Exited(address indexed who, uint256 value);
    event Supplied(address indexed owner, uint256 value);
}