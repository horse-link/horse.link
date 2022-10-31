import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useContractRead } from "wagmi";
import marketContractJson from "../../abi/Market.json";
import useApi from "../useApi";

const DECIMAL = 6;

type UsePotentialPayoutArgs = {
  marketAddress: string;
  propositionId: string;
  wager: number;
  odds: number;
  tokenDecimal: string;
};

const usePotentialPayoutFromContract = ({
  marketAddress,
  propositionId,
  wager,
  odds,
  tokenDecimal
}: UsePotentialPayoutArgs) => {
  const b32PropositionId = useMemo(
    () => ethers.utils.formatBytes32String(propositionId),
    [propositionId]
  );
  const bnWager = useMemo(
    () => ethers.utils.parseUnits(wager.toString(), tokenDecimal),
    [wager]
  );
  const bnOdds = useMemo(
    () => ethers.utils.parseUnits(odds.toString(), DECIMAL),
    [odds]
  );
  const { data: bnPotentialPayout } = useContractRead({
    addressOrName: marketAddress,
    contractInterface: marketContractJson.abi,
    functionName: "getPotentialPayout",
    args: [b32PropositionId, bnWager, bnOdds]
  });

  const potentialPayout = useMemo(() => {
    if (!bnPotentialPayout) return "0";
    return ethers.utils.formatUnits(bnPotentialPayout, tokenDecimal);
  }, [bnPotentialPayout]);

  return { potentialPayout };
};

const usePotentialPayoutFromAPI = ({
  marketAddress,
  propositionId,
  wager,
  odds,
  tokenDecimal
}: UsePotentialPayoutArgs) => {
  const [potentialPayout, setPotentialPayout] = useState("0");
  const api = useApi();
  useEffect(() => {
    if (!marketAddress || !propositionId || !wager || !odds || !tokenDecimal)
      return;
    const load = async () => {
      const { potentialPayout } = await api.getPotentialPayout(
        marketAddress,
        propositionId,
        wager,
        odds,
        tokenDecimal
      );
      setPotentialPayout(potentialPayout);
    };
    load();
  }, [api, marketAddress, propositionId, wager, odds, tokenDecimal]);
  return { potentialPayout };
};

const shouldUseAPI = process.env.REACT_APP_REST_FOR_BET;

const usePotentialPayout = (args: UsePotentialPayoutArgs) => {
  if (shouldUseAPI) {
    return usePotentialPayoutFromAPI(args);
  } else {
    return usePotentialPayoutFromContract(args);
  }
};

export default usePotentialPayout;