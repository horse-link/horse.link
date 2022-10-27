# About

Horse Link https://horse.link is an Ethereum based DeFi protocol that allows particpants to wager on sports markets using ERC20 tokens.

Traditionaly, sports betting is a multi-billion dollar industry that is dominated by a few large companies. Horse Link aims to disrupt this industry by providing a decentralized alternative that is more transparent, fair, and secure.

The "House" or "Book makers" set the odds on the events and take a percentage of the winnings. Horse Link is a decentralized protocol that allows anyone to become a book maker by creating their own market or adding liquidty to a Vault that the market draws from.

The protocol is designed to be as fair as possible by using a bonding curve to set the odds. The protocol also uses a bonding curve to set the fees that is distributed to Vault share holders. The potentail payout assimptopes to 0 as the size of the bet increases with respect to amount of liqudity in the Vault.

The market will find an equlibrium between the depth of the Vault and the size of the bet.

# How it works

Horse Link’s smart contract guaranteed bets are always placed within the slippage band of the constant product function. Like other AMM protocols based on curve functions, bets based within the range of slippage based on the potential payout will be placed.

The total (potential) return on a stake is determined by the constant product function. The constant product function is a linear function that is defined by the following equation:

Tp = D - D \* (S \ p)

f(wager) = odds - odds\*(wager/pool)

Where

- Tp is the total profit
- S is Stake
- D is the decimal odd
- p is the total locked value in the vault

The liquidity is locked in the market contract until after the participant claims their payout.

# Vaults

ERC4626 Vaults are created to allow users to deposit ERC20 tokens "underlying" into a smart contract and earn dividends on their deposits. Vault opperators then allow markets to draw down liqidity from their reserves to fund bets. The Vault operator can also set the percentage of the bet that is distributed to the Vault share holders.

# Market makers

Market makers can run the the dapp and set their own odds ...

# The API

Our own market odds can be found at https://api.horse.link/. These requests are signed by the owner.

# Contract Addresses

## Goerli

Owner: `0x1Ab4C6d9e25Fc65C917aFBEfB4E963C400Fb9814`
Horse Link Token `0xd87E8BF1327f10685c9283859A4Eb022ADbe03F9`  
Mock USDC : `0xaF2929Ed6758B0bD9575e1F287b85953B08E50BC`  
Mock DIA: `0x70b481B732822Af9beBc895779A6e261DC3D6C8B`  
LP Token: `0xB678cF41Fec0DF2D4bF69cE0297311B993deE11b`  
USDC Vault: `0x21D068720BDBc7EdC49Ce8D1b1E1fb2d6c3526eb`  
DIA Vault: `0x6F47f0864ab7a02f9E7866d2bc8aC0BCf3C4924E`  
DIA Market: `0xc8b8c94694cB8f7Aa5A2e7218D841ef492586A03`  
Registry: `0x885386d140e4321102dc218060Bbd55a8B020F4C`

## Notes

`npx truffle run verify Registry@0x885386d140e4321102dc218060Bbd55a8B020F4C --network goerli`
`npx truffle run verify Vault@0x21D068720BDBc7EdC49Ce8D1b1E1fb2d6c3526eb --network goerli`
`npx truffle run verify Vault@0x6F47f0864ab7a02f9E7866d2bc8aC0BCf3C4924E --network goerli`
`npx truffle run verify Registry --forceConstructorArgs string: --network goerli`
