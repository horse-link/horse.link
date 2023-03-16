import {
  ERC20,
  ERC20__factory,
  Market,
  MarketOracle__factory,
  Market__factory,
  Vault__factory
} from "../../typechain";
import { BigNumber, ethers, Signer } from "ethers";
import { Config, MarketInfo } from "../../types/config";
import utils from "../../utils";
import { Back, BackParams } from "../../types/meets";
import { BetHistory } from "../../types/bets";
import constants from "../../constants";
import { MARKET_ODDS_DECIMALS } from "../../constants/contracts";

export const useMarketContract = () => {
  const placeMultipleBets = async (
    signer: Signer,
    data: Array<{
      back: Back;
      market: MarketInfo;
      wager: string;
    }>,
    skipAllowanceCheck?: boolean
  ) => {
    const userAddress = await signer.getAddress();

    type MarketMultiBetInfo = {
      tokenContract: ERC20;
      marketContract: Market;
      assetAddress: string;
      allowance: BigNumber;
      totalWagers: BigNumber;
      backs: BackParams[];
    };

    const marketAddresses = [...new Set(data.map(d => d.market.address))];
    const marketMultiBetInfoList: MarketMultiBetInfo[] = [];
    const marketLookup: { [marketAddress: string]: MarketMultiBetInfo } = {};
    for (const marketAddress of marketAddresses) {
      const marketContract = Market__factory.connect(marketAddress, signer);
      const vaultAddress = await marketContract.getVaultAddress();
      const vaultContract = Vault__factory.connect(vaultAddress, signer);
      const assetAddress = await vaultContract.asset();
      const tokenContract = ERC20__factory.connect(assetAddress, signer);
      const allowance = await tokenContract.allowance(
        userAddress,
        marketAddress
      );
      const decimals = await vaultContract.decimals();
      const totalWagers = data
        .filter(
          d => d.market.address.toLowerCase() === marketAddress.toLowerCase()
        )
        .reduce((acc, curr) => {
          return acc.add(ethers.utils.parseUnits(curr.wager, decimals));
        }, BigNumber.from(0));
      const backs = data
        .filter(
          d => d.market.address.toLowerCase() === marketAddress.toLowerCase()
        )
        .map(d => {
          return { ...d.back, wager: d.wager };
        });
      const info: MarketMultiBetInfo = {
        marketContract,
        tokenContract,
        assetAddress,
        allowance,
        totalWagers,
        backs
      };
      marketLookup[marketAddress] = info;
      marketMultiBetInfoList.push(info);
    }

    // find which need to be increased
    const toProcess = marketMultiBetInfoList.filter(a =>
      a.allowance.lt(a.totalWagers)
    );

    // trigger allowances
    if (!skipAllowanceCheck) {
      await Promise.all(
        toProcess.map(async (p: MarketMultiBetInfo) => {
          return (
            await p.tokenContract.approve(
              p.marketContract.address,
              ethers.constants.MaxUint256
            )
          ).wait();
        })
      );
    }

    // place bets
    const receipts: ethers.ContractReceipt[] = [];
    for (const marketMultiBetInfo of marketMultiBetInfoList) {
      const backStructs = marketMultiBetInfo.backs.map(back => {
        return {
          nonce: back.nonce,
          propositionId: utils.formatting.formatBytes16String(
            back.proposition_id
          ),
          marketId: utils.formatting.formatBytes16String(back.market_id),
          wager: back.wager,
          odds: ethers.utils.parseUnits(
            back.odds.toString(),
            constants.contracts.MARKET_ODDS_DECIMALS
          ),
          close: back.close,
          end: back.end,
          signature: back.signature
        };
      });
      const tx = await marketMultiBetInfo.marketContract.multiBack(backStructs);
      const receipt = await tx.wait();
      receipts.push(receipt);
    }

    return receipts.map(r => r.transactionHash);
  };

  const placeBet = async (
    market: MarketInfo,
    back: Back,
    wager: BigNumber,
    signer: Signer,
    skipAllowanceCheck?: boolean
  ) => {
    const userAddress = await signer.getAddress();

    const marketContract = Market__factory.connect(market.address, signer);
    const vaultContract = Vault__factory.connect(market.vaultAddress, signer);

    const assetAddress = await vaultContract.asset();
    const erc20Contract = ERC20__factory.connect(assetAddress, signer);

    if (!skipAllowanceCheck) {
      const userAllowance = await erc20Contract.allowance(
        userAddress,
        market.address
      );
      if (userAllowance.lt(wager))
        await (
          await erc20Contract.approve(
            market.address,
            ethers.constants.MaxUint256
          )
        ).wait();
    }

    const receipt = await (
      await marketContract.back({
        nonce: back.nonce,
        propositionId: utils.formatting.formatBytes16String(
          back.proposition_id
        ),
        marketId: utils.formatting.formatBytes16String(back.market_id),
        wager,
        odds: ethers.utils.parseUnits(
          back.odds.toString(),
          constants.contracts.MARKET_ODDS_DECIMALS
        ),
        close: back.close,
        end: back.end,
        signature: back.signature
      })
    ).wait();

    return receipt.transactionHash;
  };

  const setResult = async (
    { address }: MarketInfo,
    signer: Signer,
    bet: BetHistory,
    config: Config
  ) => {
    const marketContract = Market__factory.connect(address, signer);
    const oracleAddress = await marketContract.getOracleAddress();
    const marketOracleContract = MarketOracle__factory.connect(
      oracleAddress,
      signer
    );

    try {
      if (!bet.winningPropositionId || !bet.marketOracleResultSig)
        throw new Error("No winningPropositionId or marketOracleResultSig");

      if (
        !utils.bets.recoverSigSigner(
          bet.marketId,
          bet.winningPropositionId,
          bet.marketOracleResultSig,
          config
        )
      )
        throw new Error("Signature invalid");

      // tx can fail if the result is already set
      await (
        await marketOracleContract.setResult(
          bet.marketId,
          bet.winningPropositionId,
          bet.marketOracleResultSig
        )
      ).wait();
    } catch (err: any) {
      console.error(err);
    }
  };

  const settleBet = async (
    market: MarketInfo,
    bet: BetHistory,
    signer: Signer,
    config: Config
  ) => {
    const marketContract = Market__factory.connect(market.address, signer);
    const oracleAddress = await marketContract.getOracleAddress();
    const marketOracleContract = MarketOracle__factory.connect(
      oracleAddress,
      signer
    );

    if (bet.marketOracleResultSig && !bet.scratched) {
      if (
        bet.winningPropositionId &&
        bet.marketOracleResultSig &&
        !utils.bets.recoverSigSigner(
          bet.marketId,
          bet.winningPropositionId,
          bet.marketOracleResultSig,
          config
        )
      )
        throw new Error("Signature invalid");

      if (
        !bet.marketResultAdded &&
        bet.winningPropositionId &&
        bet.marketOracleResultSig
      )
        await (
          await marketOracleContract.setResult(
            bet.marketId,
            bet.winningPropositionId,
            bet.marketOracleResultSig
          )
        ).wait();
    } else if (bet.scratched && bet.scratched.signature) {
      if (
        !utils.bets.recoverSigSigner(
          bet.marketId,
          bet.propositionId,
          bet.scratched.signature,
          config,
          ethers.utils.parseUnits(
            bet.scratched.odds.toString(),
            constants.contracts.MARKET_ODDS_DECIMALS
          ),
          ethers.BigNumber.from(bet.scratched.totalOdds)
        )
      )
        throw new Error("Signature invalid");

      // tx can fail if the result is already set
      await (
        await marketOracleContract.setScratchedResult(
          bet.marketId,
          bet.propositionId,
          ethers.utils.parseUnits(
            bet.scratched.odds.toString(),
            constants.contracts.MARKET_ODDS_DECIMALS
          ),
          ethers.BigNumber.from(bet.scratched.totalOdds),
          bet.scratched.signature
        )
      ).wait();
    }

    const receipt = await (await marketContract.settle(bet.index)).wait();

    return receipt.transactionHash;
  };

  const getPotentialPayout = async (
    market: MarketInfo,
    wager: BigNumber,
    back: Back,
    signer: Signer
  ) => {
    const marketContract = Market__factory.connect(market.address, signer);
    const odds = ethers.utils.parseUnits(
      back.odds.toString(),
      constants.contracts.MARKET_ODDS_DECIMALS
    );
    const payout = await marketContract.getPotentialPayout(
      utils.formatting.formatBytes16String(back.proposition_id),
      utils.formatting.formatBytes16String(back.market_id),
      wager,
      odds
    );
    return payout;
  };

  return {
    placeBet,
    settleBet,
    getPotentialPayout,
    setResult,
    placeMultipleBets
  };
};
