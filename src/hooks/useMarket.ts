import { useEffect, useMemo, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { useProvider, useAccount } from "wagmi";
import { market } from "../constants/market";

// TODO: fix any type here
const useMarket = (): any => {
  const provider = useProvider();
  const marketContract = useMemo(
    () =>
      new Contract(
        market.kovan.address as string,
        market.ABI,
        provider as ethers.providers.Web3Provider
      ),
    [provider]
  );

  const { isConnected } = useAccount();

  const [inPlay, setInPlay] = useState<string>("");
  const [numberOfBets, setNumberOfBets] = useState<number>(0);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    // Get inPlay
    marketContract
      .getTotalInplay()
      .then((totalInPlay: ethers.BigNumberish) => {
        // Note: we will probably need to change the formatUnits part once we get the real value.
        // This is just a hardcoded value for testing
        setInPlay(
          parseFloat(ethers.utils.formatUnits(totalInPlay, 1)).toFixed(2)
        );
      })
      .catch((err: any) => console.error(err));
  }, [marketContract, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    // Get numberOfBets
    marketContract
      .getInplayCount()
      .then((totalInPlay: ethers.BigNumberish) => {
        // Note: we will probably need to change the formatUnits part once we get the real value.
        setNumberOfBets(Number(totalInPlay));
      })
      .catch((err: any) => console.error(err));
  }, [marketContract, isConnected]);

  return {
    inPlay,
    numberOfBets
  };
};

export default useMarket;
