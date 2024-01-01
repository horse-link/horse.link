# Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Abstract

Horse Link https://horse.link is a non custodial Ethereum AMM protocol that allows participants to wager on sports markets using ERC20 tokens.

Traditionally, sports betting is a multi-billion dollar industry that is dominated by a few large companies. Horse Link aims to disrupt this industry by providing a decentralized alternative that is more transparent, fair, and secure.

The "House" or "Book makers" set the odds on the events and take a percentage of the winnings. Horse Link is a decentralized protocol that allows anyone to become a book maker by creating their own market or adding liquidity to a Vault that the market draws from.

The protocol is designed to be as fair as possible by using a bonding curve to set the odds. The protocol also uses a bonding curve to set the fees that are distributed to Vault share holders. The potential payout asymptotes to 0 as the size of the bet increases with respect to amount of liquidity in the Vault.

The market will find an equilibrium between the depth of the Vault and the size of the bet.

![image](https://user-images.githubusercontent.com/8411406/219231046-c3388f69-f48d-4042-ba0b-bcc0f3dbe685.png)

## How it works

Horse Link’s smart contract guaranteed bets are always placed within the slippage band of the constant product function. Like other AMM protocols based on curve functions, bets based within the range of slippage based on the potential payout will be placed.

The total (potential) return on a stake is determined by the constant product function. The constant product function is a linear function that is defined by the following equation:

Payout = S \* (D - D \* (S / t))

f(odds, pool, wager) = odds - odds\*(wager/pool)

f(s) = s \* f(odds)

Where

- P is the payout
- S is Stake
- D is the decimal odd
- t is the total locked value in the vault

The liquidity is locked in the market contract until after the participant claims their payout.

Status

- Resulted: finished races and no protest or dead heat

- Pending: races haven't started or those results haven't been finalised

- Settled: Settled transaction has been done by the users or another actor

## Vaults

ERC4626 Vaults are created to allow users to deposit ERC20 tokens "underlying" into a smart contract and earn dividends on their deposits. Vault operators then allow markets to draw down liqidity from their reserves to fund bets. The Vault operator can also set the percentage of the bet that is distributed to the Vault share holders.

Vaults earn income by lending to the markets.

## Market makers

Market makers can run the the dapp and set their own odds and fees. They can also set the percentage of the bet that is distributed to the Vault share holders.

## The API

Our own market odds can be found at https://horse.link/api. These requests are signed by the owner with a UUID as a nonce.

## Contract Addresses

### Arbitrum

Owner: `0x1Ab4C6d9e25Fc65C917aFBEfB4E963C400Fb9814`  
Horse Link Token `0x06d0164b1bFb040D667a82C64De870dDeac38b86`  
USDC Vault: `0x58FEa77B43aDC70d8f077598320aF6BE87135768`  
USDC Market: `0xe8aF6fa3cD01f1F2e460aBB69e054B0eF9e2d07A`  
fxAUD Vault: `0xb9943E1Eef2AF75a058ABa664846B6F80BDE9EEd`  
fxAUD Market: `0xDeEE4529E2825bae459e27866f911d188e6b54A0`  
fxUSD Vault: `0x1ACdD5D0aF0FFd42616ECC1AFf03Ba23824c8CA3`  
fxUSD Market: `0xb9943E1Eef2AF75a058ABa664846B6F80BDE9EEd`  
Registry: `0x607105259Bf6c66b0501c8BCD9D574C96088869d`  
Market Oracle: `0x14478dECfb070329948b7Ed16878F84048680bF9`

### Sepolia

Owner: `0x1Ab4C6d9e25Fc65C917aFBEfB4E963C400Fb9814`  
Horse Link Token ``  
Mock USDT : ``  
Mock DAI: ``  
USDT Vault: ``  
USDT Market: ``  
DAI Vault: ``  
DAI Market: ``  
Registry: ``  
Market Oracle: ``

### Mainnet

Horse Link Token `0xfdc066DF7d7A188786A1580a9DDFbfbE716c31d5`

## Notes

`npx hardhat verify --network sepolia 0xd90AE997C32EdE8feCe39694460543868Da0d0D1 0xd87E8BF1327f10685c9283859A4Eb022ADbe03F9`  
`npx truffle run verify Vault@0x21D068720BDBc7EdC49Ce8D1b1E1fb2d6c3526eb --network sepolia`  
`npx truffle run verify Vault@0x6F47f0864ab7a02f9E7866d2bc8aC0BCf3C4924E --network sepolia`  
`npx truffle run verify Registry --forceConstructorArgs string: --network sepolia`

## PGP Public Key

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: GPGTools - https://gpgtools.org

mDMEY4AkVBYJKwYBBAHaRw8BAQdAU+9FUdxNGY+tvYJDKcLfLVnEgR6pgLsDisyp
z3o+2uG0I2FkbWluQGhvcnNlLmxpbmsgPGFkbWluQGhvcnNlLmxpbms+iIwEEBYK
AD4FAmOAJFQECwkHCAkQbIP3dffWlFIDFQgKBBYAAgECGQECGwMCHgEWIQTxqp9x
kWGJPA8vSThsg/d199aUUgAArugBAOUUGcMJ1tdmbSHVRAyMPtInh1rqbGza/ngY
kqkFv0noAP9yKkw4WuB1yyXgD3xFVrJ+CGe9NblPSwVPE4N71IebB7g4BGOAJFQS
CisGAQQBl1UBBQEBB0BYZjZCmgK+e5DQRCkDmAo55WW+KiYdt2NI/MYM949ycgMB
CAeIeAQYFggAKgUCY4AkVAkQbIP3dffWlFICGwwWIQTxqp9xkWGJPA8vSThsg/d1
99aUUgAALMwBAIoVCO/cxjf4FTcbnRPZV+9YZKiniqLoY0bRk6x3d9nmAQCZz1SJ
YbY0ZjTeFifXI9dSpIZoH9Cb1D0xXdvGXZePBA==
=HtcE
-----END PGP PUBLIC KEY BLOCK-----
```
