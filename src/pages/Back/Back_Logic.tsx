import { ethers } from "ethers";
import { useContext, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";

import marketContractJson from "../../abi/Market.json";
import { WalletModalContext } from "../../providers/WalletModal";
import { Back } from "../../types";
import BackView from "./Back_View";

const DECIMALS = 6;

const useBacking = (back: Back) => {
  const { nonce, odds, proposition_id, market_id, close, end, signature } =
    back;

  const [wagerAmount, setWagerAmount] = useState<number>(0);
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
    addressOrName: "0xe9BC1f42bF75C59b245d39483E97C3A70c450c9b",
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

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    addressOrName: "0xe9BC1f42bF75C59b245d39483E97C3A70c450c9b",
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
    ]
  });

  const {
    data: contractData,
    error,
    isError,
    write: contractWrite
  } = useContractWrite(config);

  const txHash = contractData?.hash;

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: txHash
    });

  return {
    wagerAmount,
    setWagerAmount,
    potentialPayout,
    contract: {
      write: contractWrite,
      isError: isPrepareError || isError,
      errorMsg: (prepareError || error)?.message
    },
    txStatus: {
      isLoading: isTxLoading,
      isSuccess: isTxSuccess,
      hash: txHash
    }
  };
};

const BackLogic: React.FC = () => {
  const { propositionId } = useParams();
  const [searchParams] = useSearchParams();

  const marketId = searchParams.get("market_id");
  const odds = searchParams.get("odds");
  const close = searchParams.get("close");
  const end = searchParams.get("end");
  // wait API fix
  // const nonce = searchParams.get("nonce");
  const nonce = Date.now().toString();
  const signature = searchParams.get("signature");

  const { openWalletModal } = useContext(WalletModalContext);
  const { address } = useAccount();

  const back: Back = {
    nonce: nonce || "",
    market_id: marketId || "",
    close: parseInt(close || "0"),
    end: parseInt(end || "0"),
    odds: parseFloat(odds || "0") / 1000,
    proposition_id: propositionId || "",
    signature: signature || ""
  };

  const { wagerAmount, setWagerAmount, potentialPayout, contract, txStatus } =
    useBacking(back);

  return (
    <BackView
      back={back}
      openWalletModal={openWalletModal}
      isWalletConnected={address ? true : false}
      wagerAmount={wagerAmount}
      updateWagerAmount={amount => setWagerAmount(amount || 0)}
      potentialPayout={potentialPayout}
      contract={contract}
      txStatus={txStatus}
    />
  );
};

export default BackLogic;
