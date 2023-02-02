import {
  ERC20__factory,
  MarketOracle__factory,
  Market__factory,
  Vault__factory
} from "../../typechain";
import { BigNumber, ethers, Signer } from "ethers";
import { Config, MarketInfo } from "../../types/config";
import utils from "../../utils";
import { Back } from "../../types/meets";
import { BetHistory } from "../../types/bets";
import constants from "../../constants";

export const useMarketContract = () => {
  const placeBet = async (
    market: MarketInfo,
    back: Back,
    wager: BigNumber,
    signer: Signer
  ) => {
    const userAddress = await signer.getAddress();

    const marketContract = Market__factory.connect(market.address, signer);
    const vaultContract = Vault__factory.connect(market.vaultAddress, signer);

    const assetAddress = await vaultContract.asset();
    const erc20Contract = ERC20__factory.connect(assetAddress, signer);

    const userAllowance = await erc20Contract.allowance(
      userAddress,
      market.address
    );
    if (userAllowance.lt(wager))
      await (
        await erc20Contract.approve(market.address, ethers.constants.MaxUint256)
      ).wait();

    const receipt = await (
      await marketContract.back(
        back.nonce,
        utils.formatting.formatBytes16String(back.proposition_id),
        utils.formatting.formatBytes16String(back.market_id),
        wager,
        ethers.utils.parseUnits(
          back.odds.toString(),
          constants.contracts.MARKET_ODDS_DECIMALS
        ),
        back.close,
        back.end,
        back.signature
      )
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

  const scratchBet = async (
    { address }: MarketInfo,
    signer: Signer,
    bet: BetHistory,
    config: Config
  ) => {
    if (!bet.scratched) throw new Error("No scratched odds");
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
        await marketOracleContract.setScratchedResult(
          bet.marketId,
          bet.winningPropositionId,
          bet.scratched.odds,
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
    setResult
  };
};
