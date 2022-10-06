import { ethers } from "ethers";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";

import marketContractJson from "../../abi/Market.json";
import useMarkets from "../../hooks/useMarkets";
import { Back } from "../../types";
import BackView from "./Back_View";

const DECIMALS = 6;

const useBackingContract = (
  back: Back,
  wagerAmount: number,
  marketAddress: string
) => {
  const { nonce, odds, proposition_id, market_id, close, end, signature } =
    back;

  const [debouncedWagerAmount] = useDebounce(wagerAmount, 500);

  const b32PropositionId = useMemo(
    () => ethers.utils.formatBytes32String(proposition_id),
    [proposition_id]
  );

  const bnOdds = useMemo(
    () => ethers.utils.parseUnits(odds.toString(), DECIMALS),
    [odds]
  );

  const bnWager = useMemo(
    () => ethers.utils.parseUnits(debouncedWagerAmount.toString(), DECIMALS),
    [debouncedWagerAmount]
  );

  const { data: bnPotentialPayout } = useContractRead({
    addressOrName: marketAddress,
    contractInterface: marketContractJson.abi,
    functionName: "getPotentialPayout",
    args: [b32PropositionId, bnWager, bnOdds]
  });

  const potentialPayout = useMemo(() => {
    if (!bnPotentialPayout) return "0";
    return ethers.utils.formatUnits(bnPotentialPayout, DECIMALS);
  }, [bnPotentialPayout]);

  const b32Nonce = useMemo(
    () => ethers.utils.formatBytes32String(nonce),
    [nonce]
  );

  const b32MarketId = useMemo(
    () => ethers.utils.formatBytes32String(market_id),
    [market_id]
  );

  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: marketAddress,
    contractInterface: marketContractJson.abi,
    functionName: "back",
    args: [
      b32Nonce,
      b32PropositionId,
      b32MarketId,
      bnWager,
      bnOdds,
      close,
      end,
      signature
    ],
    enabled: debouncedWagerAmount > 0
  });

  const {
    data: contractData,
    error,
    write: contractWrite
  } = useContractWrite(config);

  const txHash = contractData?.hash;

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: txHash
    });

  return {
    potentialPayout,
    contract: {
      write: contractWrite,
      errorMsg: (prepareError || error)?.message
    },
    txStatus: {
      isLoading: isTxLoading,
      isSuccess: isTxSuccess,
      hash: txHash
    }
  };
};

const usePageParams = () => {
  const { propositionId } = useParams();
  const [searchParams] = useSearchParams();

  const marketId = searchParams.get("market_id");
  const odds = searchParams.get("odds");
  const close = searchParams.get("close");
  const end = searchParams.get("end");
  // wait API fix
  // const nonce = searchParams.get("nonce");
  const nonce = useMemo(() => Date.now().toString(), []);
  const signature = searchParams.get("signature");

  const back: Back = {
    nonce: nonce || "",
    market_id: marketId || "",
    close: parseInt(close || "0"),
    end: parseInt(end || "0"),
    odds: parseFloat(odds || "0") / 1000,
    proposition_id: propositionId || "",
    signature: signature || ""
  };
  return { back };
};

const BackLogic: React.FC = () => {
  const { back } = usePageParams();
  const { marketAddresses } = useMarkets();
  const [selectedMarketAddress, setSelectedMarketAddress] = useState<string>(
    marketAddresses[0]
  );
  const [wagerAmount, setWagerAmount] = useState<number>(0);
  const { potentialPayout, contract, txStatus } = useBackingContract(
    back,
    wagerAmount,
    selectedMarketAddress
  );

  const shouldButtonDisabled = !contract.write || txStatus.isLoading;

  return (
    <BackView
      back={back}
      markets={marketAddresses}
      selectedMarket={selectedMarketAddress}
      setSelectedMarket={setSelectedMarketAddress}
      wagerAmount={wagerAmount}
      updateWagerAmount={amount => setWagerAmount(amount || 0)}
      potentialPayout={potentialPayout}
      shouldButtonDisabled={shouldButtonDisabled}
      contract={contract}
      txStatus={txStatus}
    />
  );
};

export default BackLogic;
