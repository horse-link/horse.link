import { Market__factory } from "../../typechain";
import { useProvider } from "wagmi";
import { Back } from "../../types";
import { BigNumber } from "ethers";

const useMarketContract = () => {
  const provider = useProvider();

  const placeBet = async (marketAddress: string, back: Back, wager: BigNumber) => {
    const contract = Market__factory.connect(marketAddress, provider);
    const receipt = await (
      await contract.back(
        back.nonce, 
        back.proposition_id, 
        back.market_id, 
        wager, 
        back.odds, 
        back.close, 
        back.end, 
        back.signature
      )
    ).wait();

    return receipt.transactionHash;
  };

  return {
    placeBet,
  }
};

export default useMarketContract;