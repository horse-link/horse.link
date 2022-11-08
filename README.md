# About

Horse Link https://horse.link is an Ethereum AMM protocol that allows particpants to wager on sports markets using ERC20 tokens.

Traditionally, sports betting is a multi-billion dollar industry that is dominated by a few large companies. Horse Link aims to disrupt this industry by providing a decentralized alternative that is more transparent, fair, and secure.

The "House" or "Book makers" set the odds on the events and take a percentage of the winnings. Horse Link is a decentralized protocol that allows anyone to become a book maker by creating their own market or adding liquidity to a Vault that the market draws from.

The protocol is designed to be as fair as possible by using a bonding curve to set the odds. The protocol also uses a bonding curve to set the fees that are distributed to Vault share holders. The potential payout asymptotes to 0 as the size of the bet increases with respect to amount of liquidity in the Vault.

The market will find an equilibrium between the depth of the Vault and the size of the bet.

# How it works

Horse Link’s smart contract guaranteed bets are always placed within the slippage band of the constant product function. Like other AMM protocols based on curve functions, bets based within the range of slippage based on the potential payout will be placed.

The total (potential) return on a stake is determined by the constant product function. The constant product function is a linear function that is defined by the following equation:

Tp = S \* (D - D \* (S \ p))

f(wager) = odds - odds\*(wager/pool)

Where

- Tp is the total profit
- S is Stake
- D is the decimal odd
- p is the total locked value in the vault

The liquidity is locked in the market contract until after the participant claims their payout.

# Vaults

ERC4626 Vaults are created to allow users to deposit ERC20 tokens "underlying" into a smart contract and earn dividends on their deposits. Vault operators then allow markets to draw down liqidity from their reserves to fund bets. The Vault operator can also set the percentage of the bet that is distributed to the Vault share holders.

# Market makers

Market makers can run the the dapp and set their own odds ...

# The API

Our own market odds can be found at https://api.horse.link/. These requests are signed by the owner with a UUID as a nonce.

# Contract Addresses

## Goerli

Owner: `0x1Ab4C6d9e25Fc65C917aFBEfB4E963C400Fb9814`  
Horse Link Token `0xd87E8BF1327f10685c9283859A4Eb022ADbe03F9`  
Mock USDC : `0xaF2929Ed6758B0bD9575e1F287b85953B08E50BC`  
Mock DIA: `0x70b481B732822Af9beBc895779A6e261DC3D6C8B`  
LP Token: `0xB678cF41Fec0DF2D4bF69cE0297311B993deE11b`  
USDC Vault: `0x77049b43746F9DF174829B4AA3931fE0fCF70280`  
USDC Market: `0xAbA5571aF0cC8Ea36bB4553D6C4B935B0F53E91e`  
DIA Vault: `0x7e8Aa9bC57CA64Bf3F91fcE3B0A5F740239F8f59`  
DIA Market: `0xA0f8A6eD9Df461541159Fa5f083082A6f6E0f795`  
Registry: `0xd90AE997C32EdE8feCe39694460543868Da0d0D1`  
Market Oracle: `0x592a44ebad029EBFff3Ee4950f1E74538a19a2ea`  

## Mainnet

Horse Link Token `0xfdc066DF7d7A188786A1580a9DDFbfbE716c31d5`

## Notes

`npx truffle run verify Registry@0xd90AE997C32EdE8feCe39694460543868Da0d0D1 --network goerli`  
`npx truffle run verify Vault@0x21D068720BDBc7EdC49Ce8D1b1E1fb2d6c3526eb --network goerli`  
`npx truffle run verify Vault@0x6F47f0864ab7a02f9E7866d2bc8aC0BCf3C4924E --network goerli`  
`npx truffle run verify Registry --forceConstructorArgs string: --network goerli`  
