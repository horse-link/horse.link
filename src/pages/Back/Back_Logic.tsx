import { ethers } from "ethers";
import { useMemo, useState } from "react";
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
import useMarkets from "../../hooks/useMarkets";
import useTokenApproval from "../../hooks/useTokenApproval";
import useTokenData from "../../hooks/useTokenData";
import { Back } from "../../types";
import BackView from "./Back_View";

const DECIMAL = 6;

const usePotentialPayout = (
  marketAddress: string,
  b32PropositionId: string,
  bnWager: ethers.BigNumber,
  bnOdds: ethers.BigNumber
) => {
  const { data: bnPotentialPayout } = useContractRead({
    addressOrName: marketAddress,
    contractInterface: marketContractJson.abi,
    functionName: "getPotentialPayout",
    args: [b32PropositionId, bnWager, bnOdds]
  });

  const potentialPayout = useMemo(() => {
    if (!bnPotentialPayout) return "0";
    return ethers.utils.formatUnits(bnPotentialPayout, DECIMAL);
  }, [bnPotentialPayout]);

  return { potentialPayout };
};

const usePrepareBackingData = (
  //proposition_id: string,
  proposition_id_hash: string,
  odds: number,
  tokenDecimal: string,
  debouncedWagerAmount: number,
  nonce: string,
  market_id: string
) => {
  const b32PropositionId = useMemo(
    () => ethers.utils.formatBytes32String(proposition_id_hash),
    [proposition_id_hash]
  );

  const bnOdds = useMemo(
    () => ethers.utils.parseUnits(odds.toString(), DECIMAL),
    [odds]
  );

  const bnWager = useMemo(
    () => ethers.utils.parseUnits(debouncedWagerAmount.toString(), DECIMAL),
    [debouncedWagerAmount]
  );

  const b32Nonce = useMemo(
    () => ethers.utils.formatBytes32String(nonce),
    [nonce]
  );

  const b32MarketId = useMemo(
    () => ethers.utils.formatBytes32String(market_id),
    [market_id]
  );
  return { b32PropositionId, bnWager, bnOdds, b32Nonce, b32MarketId };
};

type useBackContractWriteArgs = {
  marketAddress: string;
  b32Nonce: string;
  b32PropositionId: string;
  b32MarketId: string;
  bnWager: ethers.BigNumber;
  bnOdds: ethers.BigNumber;
  close: number;
  end: number;
  signature: string;
  enabled: boolean;
};

const useBackContractWrite = ({
  marketAddress,
  b32Nonce,
  b32PropositionId,
  b32MarketId,
  bnWager,
  bnOdds,
  close,
  end,
  signature,
  enabled
}: useBackContractWriteArgs) => {
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
    enabled
  });

  const {
    data: contractData,
    error: writeError,
    write
  } = useContractWrite(config);

  const backTxHash = contractData?.hash;

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: backTxHash
    });

  return {
    write,
    error: prepareError || writeError,
    isTxLoading,
    isTxSuccess,
    backTxHash
  };
};

const useBackingContract = (
  back: Back,
  wagerAmount: number,
  marketAddress: string,
  ownerAddress: string
) => {
  const { nonce, odds, proposition_id_hash, market_id, close, end, signature } =
    back;

  const [debouncedWagerAmount] = useDebounce(wagerAmount, 500);

  const { data: vaultAddressData } = useContractRead({
    addressOrName: marketAddress,
    contractInterface: marketContractJson.abi,
    functionName: "getVaultAddress"
  });

  const vaultAddress = vaultAddressData?.toString() ?? "";

  const { address: tokenAddress, decimals: tokenDecimal } =
    useTokenData(vaultAddress);

  const {
    allowance,
    write: approveContractWrite,
    error: approveError,
    isTxLoading: isApproveTxLoading
  } = useTokenApproval(tokenAddress, ownerAddress, vaultAddress, tokenDecimal);

  const isEnoughAllowance = allowance > 0 && allowance >= wagerAmount;

  const { b32PropositionId, bnWager, bnOdds, b32Nonce, b32MarketId } =
    usePrepareBackingData(
      proposition_id_hash,
      odds,
      tokenDecimal,
      debouncedWagerAmount,
      nonce,
      market_id
    );

  const { potentialPayout } = usePotentialPayout(
    marketAddress,
    proposition_id_hash,
    bnWager,
    bnOdds
  );

  const {
    write: backContractWrite,
    error: backError,
    isTxLoading: isBackTxLoading,
    isTxSuccess: isBackTxSuccess,
    backTxHash
  } = useBackContractWrite({
    marketAddress,
    b32Nonce,
    b32PropositionId,
    b32MarketId,
    bnWager,
    bnOdds,
    close,
    end,
    signature,
    enabled: debouncedWagerAmount > 0 && isEnoughAllowance
  });

  return {
    potentialPayout,
    contract: {
      backContractWrite,
      approveContractWrite,
      errorMsg: (backError || approveError)?.message
    },
    txStatus: {
      isLoading: isBackTxLoading || isApproveTxLoading,
      isSuccess: isBackTxSuccess,
      hash: backTxHash
    },
    isEnoughAllowance
  };
};

const usePageParams = () => {
  const { proposition_id_hash } = useParams();
  const [searchParams] = useSearchParams();

  const marketId = searchParams.get("market_id");
  const odds = searchParams.get("odds");
  const close = searchParams.get("close");
  const end = searchParams.get("end");
  // wait API fix
  // const nonce = searchParams.get("nonce");
  const nonce = useMemo(() => Date.now().toString(), []); // todo: get from api
  const signature = searchParams.get("signature");

  const back: Back = {
    nonce: nonce || "",
    market_id: marketId || "",
    close: parseInt(close || "0"),
    end: parseInt(end || "0"),
    odds: parseFloat(odds || "0") / 1000,
    proposition_id_hash: proposition_id_hash || "",
    signature: signature || ""
  };
  return { back };
};

const BackLogic: React.FC = () => {
  const { back } = usePageParams();
  const { marketAddresses } = useMarkets();
  const { address } = useAccount();
  const ownerAddress = address ?? "";
  const [selectedMarketAddress, setSelectedMarketAddress] = useState<string>(
    marketAddresses[0]
  );
  const [wagerAmount, setWagerAmount] = useState<number>(0);
  const { potentialPayout, contract, txStatus, isEnoughAllowance } =
    useBackingContract(back, wagerAmount, selectedMarketAddress, ownerAddress);

  const shouldButtonDisabled =
    wagerAmount == 0 || !contract?.backContractWrite || txStatus.isLoading;

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
      isEnoughAllowance={isEnoughAllowance}
    />
  );
};

export default BackLogic;
