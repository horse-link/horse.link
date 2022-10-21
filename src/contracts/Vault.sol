// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IBurnable.sol";
import "./IMarket.sol";
import "./IMintable.sol";
import "./IVault.sol";

struct Reward {
    uint256 balance;
    uint256 start;
}

contract Vault is Ownable, IERC20, IVault {
    // ERC20
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    mapping(address => uint256) private _shares;

    uint256 private _totalSupply; // total shares
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    uint256 private _totalAssets; // total assets in underlying

    address private immutable _underlying;
    address private immutable _self;

    uint256 private constant PRECISSION = 1_000;
    address private _market;

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function getMarket() external view returns (address) {
        assert(_market != address(0));
        return _market;
    }

    function setMarket(address market) public onlyOwner() {
        require(_market == address(0), "Market already set");

        // could do some checks here
        // require(IMarket(_market).getTarget() < 200, "Market target is too high");
        _market = market;

        ERC20(_underlying).approve(_market, type(uint256).max);
    }

    function getPerformance() external view returns (uint256) {
        return _getPerformance();
    }

    function _getPerformance() private view returns (uint256) {
        uint256 underlyingBalance = IERC20(_underlying).balanceOf(_self);

        if (underlyingBalance > 0)
            return (_totalSupply / underlyingBalance) * 100;

        return 0;
    }

    // function getInPlay() external view returns (uint256) {
    //     return _getInPlay();
    // }

    // function _getInPlay() private view returns (uint256) {        
    //     return IERC20(_underlying).balanceOf(_market);
    // }

    function convertToAssets(uint256 shares) external view returns (uint256 assets) {
        return _convertToAssets(shares);
    }

    function _convertToAssets(uint256 shares) private view returns (uint256 assets) {
        uint256 inPlay = IERC20(_underlying).balanceOf(_market);

        assets = shares / (_totalAssets - inPlay);
    }

    function convertToShares(uint256 assets) external view returns (uint256 shares) {
        return _convertToShares(assets);
    }

    function _convertToShares(uint256 assets) private view returns (uint256 shares) {
        if (_totalAssets == 0) {
            shares = assets;
        } else {
            shares = (assets * _totalSupply) / _totalAssets;
        }
    }

    // IERC4626
    function asset() external view returns (address assetTokenAddress) {
        return _underlying;
    }

    function totalAssets() external view returns (uint256) {
        return _totalAssets;
    }

    constructor(address underlying) {
        require(underlying != address(0), "Underlying address is invalid");

        _self = address(this);
        _underlying = underlying;
        
        _symbol = string(abi.encodePacked("HL", ERC20(underlying).symbol()));
        _name = string(abi.encodePacked("HL ", ERC20(underlying).name()));
        _decimals = ERC20(underlying).decimals();
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, _allowances[owner][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = _allowances[owner][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    // Add underlying tokens to the pool
    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        require(assets > 0, "Value must be greater than 0");
        require(_market != address(0), "Deposits not allowed until market is set"); // make this a modifier

        if (receiver == address(0))
            receiver = _msgSender();

        shares = _convertToShares(assets);
        _mint(receiver, shares);

        IERC20(_underlying).transferFrom(receiver, _self, assets);
        IERC20(_underlying).approve(_market, _totalSupply);

        emit Deposit(receiver, assets);
    }

    function maxWithdraw(address owner) external view returns (uint256 maxAssets) {
        maxAssets = _balances[owner];
    }

    function previewWithdraw(uint256 assets) external view returns (uint256 shares) {
        shares = _previewWithdraw(assets);
    }

    function _previewWithdraw(uint256 assets) private view returns (uint256) {
        uint256 underlyingBalance = IERC20(_underlying).balanceOf(address(this));
        uint256 inPlay = IERC20(_underlying).balanceOf(_market);

        return assets * underlyingBalance / (underlyingBalance + inPlay);
    }

    // Exit your position
    function withdraw(uint256 shares) external {
        uint256 balance = _balances[msg.sender];
        require(balance >= shares, "withdraw: You do not have enough shares");

        uint256 amount = _previewWithdraw(shares);
        _totalSupply -= balance;
        _balances[msg.sender] = 0;
        
        IERC20(_underlying).approve(_market, _totalSupply);
        IERC20(_underlying).transfer(msg.sender, amount);
        // decreaseAllowance(_market, amount);

        emit Withdraw(msg.sender, balance);
    }

    function _mint(address account, uint256 amount) private {
        require(account != address(0), "_mint: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) private {
        require(account != address(0), "_burn: burn from the zero address");

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "_burn: burn amount exceeds balance");

        _balances[account] -= amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    function _transfer(address from, address to,uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    modifier onlyMarket() {
        require(_market != address(0), "Market not set");
        require(msg.sender == _market, "Only the market can call this function");
        _;
    }
}