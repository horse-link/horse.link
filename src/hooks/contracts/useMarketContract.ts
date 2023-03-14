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
  const placeMultipleBets = async (
    signer: Signer,
    data: Array<{
      back: Back;
      market: MarketInfo;
      wager: BigNumber;
    }>,
    skipAllowanceCheck?: boolean
  ) => {
    const userAddress = await signer.getAddress();
    const markets = [...new Set(data.map(d => d.market))];

    // do allowance checks
    if (!skipAllowanceCheck) {
      const assetAddresses = await Promise.all(
        data.map(async d => {
          const vault = Vault__factory.connect(d.market.vaultAddress, signer);
          return {
            marketAddress: d.market.address,
            assetAddress: await vault.asset()
          };
        })
      );
      const assetSet = [...new Set(assetAddresses)];

      // get allowances
      const allowances = await Promise.all(
        assetSet.map(async ({ assetAddress, marketAddress }) => {
          const contract = ERC20__factory.connect(assetAddress, signer);
          return {
            marketAddress,
            assetAddress,
            allowance: await contract.allowance(userAddress, marketAddress)
          };
        })
      );

      // get wagers
      const wagers = [
        ...new Set(
          data.map(d => ({
            marketAddress: d.market.address,
            wager: d.wager
          }))
        )
      ];

      // find which need to be increased
      const toProcess = allowances.filter(({ marketAddress, allowance }) => {
        const matchingWager = wagers.find(
          w => w.marketAddress.toLowerCase() === marketAddress.toLowerCase()
        );
        if (!matchingWager) return false;

        return matchingWager.wager.lt(allowance);
      });

      // trigger allowances
      await Promise.all(
        toProcess.map(async p => {
          const erc20 = ERC20__factory.connect(p.assetAddress, signer);

          return (
            await erc20.approve(p.marketAddress, ethers.constants.MaxUint256)
          ).wait();
        })
      );
    }

    const receipts = await Promise.all(
      markets.map(async m => {
        const contract = Market__factory.connect(m.address, signer);
        const backs = data
          .filter(
            d => d.market.address.toLowerCase() === m.address.toLowerCase()
          )
          .map(d => ({
            ...d.back,
            propositionId: d.back.proposition_id,
            marketId: d.back.market_id,
            wager: d.wager
          }));

        return (await contract.multiBack(backs)).wait();
      })
    );

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
