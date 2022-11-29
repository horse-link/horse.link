import {
  ERC20__factory,
  MarketOracle__factory,
  Market__factory,
  Vault__factory
} from "../../typechain";
import { Back, BetHistory } from "../../types";
import { BigNumber, ethers, Signer } from "ethers";
import { MarketInfo } from "../../types/config";
import { formatBytes16String } from "../../utils/formatting";

const ODDS_DECIMALS = 6;

const useMarketContract = () => {
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
        formatBytes16String(back.proposition_id),
        formatBytes16String(back.market_id),
        wager,
        ethers.utils.parseUnits(back.odds.toString(), ODDS_DECIMALS),
        back.close,
        back.end,
        back.signature
      )
    ).wait();

    return receipt.transactionHash;
  };

  const settleBet = async (
    market: MarketInfo,
    bet: BetHistory,
    signer: Signer
    // sig: EcSignature -- re-add when marketOracle accepts ecdsa sigs
  ) => {
    const marketContract = Market__factory.connect(market.address, signer);
    const oracleAddress = await marketContract.getOracleAddress();
    const marketOracleContract = MarketOracle__factory.connect(
      oracleAddress,
      signer
    );

    if (!bet.marketResultAdded)
      await (
        await marketOracleContract.setResult(
          bet.marketId,
          bet.propositionId,
          ethers.constants.HashZero
        )
      ).wait();

    const receipt = await (await marketContract.settle(bet.index)).wait();

    return receipt.transactionHash;
  };

  return {
    placeBet,
    settleBet
  };
};

export default useMarketContract;
