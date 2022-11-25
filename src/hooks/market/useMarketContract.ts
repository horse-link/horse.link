import {
  ERC20__factory,
  Market__factory,
  Vault__factory
} from "../../typechain";
import { Back } from "../../types";
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

    console.log(`Backing with:`);
    console.log("nonce", formatBytes16String(back.nonce));
    console.log("proposition_id", formatBytes16String(back.proposition_id));
    console.log("market_id", formatBytes16String(back.market_id));

    const receipt = await (

      await marketContract.back(
        formatBytes16String(back.nonce),
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

  return {
    placeBet
  };
};

export default useMarketContract;
