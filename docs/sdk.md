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

## Parameters

None

## Returns

Returns the total amount of asset tokens deposited as bets into all registered Market contracts.

### Response attributes

- total

```ts
const { total } = hl.getTotalInPlay();
```

# Get market contracts

```js
const marketAddresses = await hl.getMarketAddresses();
```

## Parameters

None

## Returns

Returns an array of address for all registered market contracts.

# Get details of a market contract

```js
const market: MarketContract = await hl.getMarket("0x123...456");
```

## Parameters

### market_address

The address of the market contract.

## Returns

A `MarketContract` object representing the details of the requested market contract.

# Get details of all market contracts

```js
const markets: MarketContract[] = await hl.getMarkets();
```

## Parameters

None

## Returns

An array of `MarketContract` objects representing the details of all registered market contracts.

# Get the result for a market

```js
const result: SignedBetData = await hl.getMarketResult(marketId);
```

## Parameters

### marketId

The identifier for a market (within a market contract)

## Returns

A `SignedBetData` object representing the result signature for the specified market.

# Get registered asset tokens

```js
const assetTokens: string[] = await hl.getRegisteredAssetTokens();
```

## Parameters

None

## Returns

An array of addresses for all registered asset tokens.

# Get a token allowance

```js
const allowance: string = await hl.getMarketAllowance(
  tokenAddress,
  tokenOwner,
  tokenSpender,
  decimals
);
```

## Parameters

### tokenAddress

The address of an ERC-20 token

### tokenOwner

A wallet address

### tokenSpender

The address of a wallet which has an allowance to spend `tokenOwner`'s tokens

### decimals

Format the response with a given number of decimals points.

## Returns

A string representing a number of tokens that `tokenSpender` can spend on behalf of `tokenOwner`, eg `1000.123456`

# Get odds

```js
const odds: string = await hl.getOdds(
  marketContractAddress,
  propositionId,
  wagerAmount
);
```

## Parameters

### marketContractAddress

The address of a MarketContract

### propositionId

The id of a proposition that can be bet on

### wagerAmount

The amount of tokens to bet

## Returns

A numeric string representing the odds that would be given for this proposition, expressed as a positive number, where 1 x 10^6 represents decimal odds of 1.0, eg `1234567` for decimal odds of `1.234567`

# Get potential payout

```js
const payout: string = await hl.getPayout(
  marketContractAddress,
  propositionId,
  wagerAmount,
  odds
);
```

## Parameters

### marketContractAddress

The address of a MarketContract

### propositionId

The id of a proposition that can be bet on

### wagerAmount

The amount of tokens to bet

### odds

The odds of the proposition, expressed as a positive number, where 1 x 10^6 represents decimal odds of 1.0

## Returns

A string representing the potential payout of a bet in tokens, formatted with the correct number of decimals for the ERC token used in the specified market, eg `1000.123456`

# Request funds from faucet

```js
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

The address of a vault contract

## Returns

A string representing the performance of the specified vault, expressed as a percentage, eg `120.123456`

# Get vault liquidity

```js
const liquidity: string = await hl.getVaultLiquidity(vaultAddress);
```

## Parameters

### vaultAddress

The address of a vault contract

## Returns

A numeric string representing the number of asset tokens underlying shares for the specified vault, using the correct number of decimals for the ERC-20 token used in the specified vault, eg `10099990.123456`

# Get vault statistics

```ts
const statistics: VaultStatistics = await hl.getVaultStats(
  vaultAddress,
  investorAddress
);
```

## Parameters

### vaultAddress

The address of a vault contract

### investorAddress

The address of an investor

## Returns

A `VaultStatistics` object representing the statistics for the specified vault and investor.

# Objects

## Config object

### Attributes

- Addresses
- Markets
- Vaults

## MarketContract object

## SignedBetData object

### marketResultAdded

A boolean indicating whether the result has been added to the market contract.

### winningPropositionId

The ID of the winning proposition.

### marketOracleResultSig

The signature of the market result, in the form of a `Signature` object.

## VaultStatistics object

### liquidity

A numeric string representing the number of asset tokens underlying shares for the specified vault, using the correct number of decimals for the ERC-20 token used in the specified vault, eg `10099990.123456`

### userBalance

A numeric string representing the number of shares held by the specified investor, using the correct number of decimals for the ERC-20 token used in the specified vault, eg `10099990.123456`

### userPerformance

A string representing the performance of the specified vault for the specified investor, expressed as a percentage, eg `120.123456`

### assetTokenAddress

The address of the ERC-20 token used as an underlying asset in the specified vault
