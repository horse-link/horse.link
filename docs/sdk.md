# HORSELINK SDK

## Index

- [Getting started](#getting-started)
-

# Getting started

```ts
const hl = new HorseLink(options);
```

## Options object

### provider

The Ethereum provider to use. Defaults to `window.ethereum` if available.

# PLATFORM

# Get configuration

## Parameters

None

## Returns

Return the configuration of the HorseLink platform to which you are connected.

Responds with a `Config` object

```ts
const config = await hl.getConfig();
```

# Get total in play

```ts
const total: string = hl.getTotalInPlay(marketAddress);
```

## Parameters

None

## Returns

Returns a numeric string represending the total amount of asset tokens deposited as bets into the specified Market contract, formatted with the correct number of decimals for the ERC-20 asset token used in the specified market, eg `"1000.123456"`.

# Get platform totals

```
const totals: PlatformTotals = await hl.getPlatformTotals();
```

## Parameters

None

## Returns

A `PlatformTotals` object containing properties for number of vaults, market contracts and bets in the platform.

# Get platform statistics

```
const statistics: PlatformStatistics = await hl.getPlatformStatistics();
```

## Parameters

None

## Returns

A `PlatformStatistics` object containing aggregated statistics for all registered vaults and market contracts.

# MARKETS

# Get market contracts

```ts
const marketAddresses = await hl.getMarketAddresses();
```

## Parameters

None

## Returns

Returns an array of address for all registered market contracts.

# Get details of a market contract

```ts
const market: MarketContract = await hl.getMarket("0x123...456");
```

## Parameters

### market_address

The address of the market contract.

## Returns

A `MarketContract` object representing the details of the requested market contract.

# Get details of all market contracts

```ts
const markets: MarketContract[] = await hl.getMarkets();
```

## Parameters

None

## Returns

An array of `MarketContract` objects representing the details of all registered market contracts.

# Get the result for a market

```ts
const result: SignedBetData = await hl.getMarketResult(marketId);
```

## Parameters

### marketId

The identifier for a market (within a market contract)

## Returns

A `SignedBetData` object representing the result signature for the specified market.

# TOKENS

# Get registered asset tokens

```ts
const assetTokens: string[] = await hl.getRegisteredAssetTokens();
```

## Parameters

None.

## Returns

An array of addresses for all registered asset tokens.

# Get a token allowance

```ts
const allowance: string = await hl.getMarketAllowance(
  tokenAddress,
  tokenOwner,
  tokenSpender,
  decimals
);
```

## Parameters

### tokenAddress

The address of an ERC-20 token.

### tokenOwner

A wallet address.

### tokenSpender

The address of a wallet which has an allowance to spend `tokenOwner`'s tokens.

### decimals

Format the response with a given number of decimals points.

## Returns

A string representing a number of tokens that `tokenSpender` can spend on behalf of `tokenOwner`, eg `1000.123456`.

# Request funds from faucet

```ts
const txHash: string = await hl.requestFunds(tokenAddress, recipientAddress);
```

## Parameters

### tokenAddress

The address of the token contract for which you want to request funds.

### recipientAddress

The address of the wallet to which you want the funds sent.

## Action

Requests funds from the faucet for the specified token contract and sends them to the specified recipient address.

## Returns

A transaction hash.

# BETS

# Get bets

```ts
const bets: Bet[] = await hl.getBets(userAddress, filter);
```

## Parameters

### user address

The address of a user.

### filter

A string representing the type of bets to return. Can be one of the following:

- `all` - all bets (default)
- `resulted` - bets that have a result but have not yet been settled
- `settled` - bets that have been settled

## Returns

An array of `Bet` objects representing bets made by the specified user.

# Get odds

```ts
const odds: string = await hl.getOdds(
  marketContractAddress,
  propositionId,
  wagerAmount
);
```

## Parameters

### marketContractAddress

The address of a MarketContract.

### propositionId

The id of a proposition that can be bet on.

### wagerAmount

The amount of tokens to bet.

## Returns

A numeric string representing the odds that would be given for this proposition, expressed as a positive number, where 1 x 10^6 represents decimal odds of 1.0, eg `1234567` for decimal odds of `1.234567`.

# Get potential payout

For a hypothetical bet on a proposition with the specified odds, what would the payout be if the bet was successful?

```ts
const payout: string = await hl.getPayout(
  marketContractAddress,
  propositionId,
  wagerAmount,
  odds
);
```

## Parameters

### marketContractAddress

The address of a MarketContract.

### propositionId

The id of a proposition that can be bet on.

### wagerAmount

The amount of tokens to bet.

### odds

The odds of the proposition, expressed as a positive number, where `1 x 10^6` represents decimal odds of `1.0`.

## Returns

A string representing the potential payout of a bet in tokens, formatted with the correct number of decimals for the ERC token used in the specified market, eg `1000.123456`.

# VAULTS

# Get registered vault contracts

```ts
const vaultAddresses: string[] = await hl.getRegisteredVaults();
```

## Parameters

None

## Returns

An array of addresses for all registered vault contracts.

# Get vault performance

```ts
const performancePercentage: string = await hl.getVaultPerformance(
  vaultAddress
);
```

## Parameters

### vaultAddress

The address of a vault contract.

## Returns

A string representing the performance of the specified vault, expressed as a percentage, eg `120.123456`.

# Get vault liquidity

```ts
const liquidity: string = await hl.getVaultLiquidity(vaultAddress);
```

## Parameters

### vaultAddress

The address of a vault contract.

## Returns

A numeric string representing the number of asset tokens underlying shares for the specified vault, using the correct number of decimals for the ERC-20 token used in the specified vault, eg `10099990.123456`.

# Get vault statistics

```ts
const statistics: VaultStatistics = await hl.getVaultStats(
  vaultAddress,
  investorAddress
);
```

## Parameters

### vaultAddress

The address of a vault contract.

### investorAddress

The address of an investor.

## Returns

A `VaultStatistics` object representing the statistics for the specified vault and investor.

# Get vault history

```
const history: VaultActivity[] = await hl.getVaultHistory(vaultAddress);
```

## Parameters

### vaultAddress

The address of a vault contract.

## Returns

An array of `VaultActivity` objects containing historical data for the specified vault.

# USERS

# Get user statistics

```
const history: UserStatistics = await hl.getUserStatistics(userAddress);
```

## Parameters

### userAddress

The address of a user.

## Returns

An array of `UserActivity` objects containing historical data for the specified user.

# Objects

## Config object

### Attributes

- Addresses
- Markets
- Vaults

#

## MarketContract object

#

## SignedBetData object

### marketResultAdded

A boolean indicating whether the result has been added to the market contract.

### winningPropositionId

The ID of the winning proposition.

### marketOracleResultSig

The signature of the market result, in the form of a `Signature` object.

#

## VaultStatistics object

### liquidity

A numeric string representing the number of asset tokens underlying shares for the specified vault, using the correct number of decimals for the ERC-20 token used in the specified vault, eg `10099990.123456`.

### userBalance

A numeric string representing the number of shares held by the specified investor, using the correct number of decimals for the ERC-20 token used in the specified vault, eg `10099990.123456`.

### userPerformance

A string representing the performance of the specified vault for the specified investor, expressed as a percentage, eg `120.123456`.

### assetTokenAddress

The address of the ERC-20 token used as an underlying asset in the specified vault.

#

## PlatformStatistics object

TODO

#

## VaultActivity object

TODO

#

## UserStatistics object

### totalDeposited

### inPlay

### pnl

### lastUpdate

#

## Bet object

### id

The ID of the bet.

### propositionId

The ID of the proposition that was bet on.

### marketId

The ID of the market that the bet was made on.

### amount

The amount of tokens that was bet.

### payout

The amount of tokens that were/could have been paid out.

### won

A boolean indicating whether the bet was successful.

### settled

A boolean indicating whether the bet has been settled.
