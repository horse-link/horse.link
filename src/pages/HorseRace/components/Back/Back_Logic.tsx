import { ethers } from "ethers";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction
} from "wagmi";

import marketContractJson from "../../../../abi/Market.json";
import useMarkets from "../../../../hooks/useMarkets";
import useTokenApproval from "../../../../hooks/useTokenApproval";
import useTokenData from "../../../../hooks/useTokenData";
import { Back, Runner } from "../../../../types";
import BackView from "./Back_View";

const DECIMAL = 6;

const usePotentialPayout = (
  marketAddress: string,
  b32PropositionId: string,
  bnWager: ethers.BigNumber,
  bnOdds: ethers.BigNumber,
  tokenDecimal: string
) => {
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

const usePrepareBackingData = (
  proposition_id: string,
  odds: number,
  tokenDecimal: string,
  debouncedWagerAmount: number,
  nonce: string,
  market_id: string
) => {
  const b32PropositionId = useMemo(
    () => ethers.utils.formatBytes32String(proposition_id),
    [proposition_id]
  );

  const bnOdds = useMemo(
    () => ethers.utils.parseUnits(odds.toString(), DECIAML),
    [odds]
  );

  const bnWager = useMemo(
    () =>
      ethers.utils.parseUnits(debouncedWagerAmount.toString(), tokenDecimal),
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
  const {
    data: contractData,
    error,
    write
  } = useContractWrite({
    mode: "recklesslyUnprepared",
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
    enabled: enabled && !!marketAddress
  });

  const backTxHash = contractData?.hash;

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: backTxHash
    });

  return {
    write,
    error,
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
  const { nonce, odds, proposition_id, market_id, close, end, signature } =
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
  } = useTokenApproval(tokenAddress, ownerAddress, marketAddress, tokenDecimal);

  const isEnoughAllowance = allowance > 0 && allowance >= wagerAmount;

  const { b32PropositionId, bnWager, bnOdds, b32Nonce, b32MarketId } =
    usePrepareBackingData(
      proposition_id,
      odds,
      tokenDecimal,
      debouncedWagerAmount,
      nonce,
      market_id
    );

  const { potentialPayout } = usePotentialPayout(
    marketAddress,
    b32PropositionId,
    bnWager,
    bnOdds,
    tokenDecimal
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

const usePageParams = (runner?: Runner) => {
  const {
    proposition_id = "",
    market_id = "",
    odds = 0,
    close = 0,
    end = 0,
    signature
  } = runner ?? {};

  // todo: get nonce from runner once api is updated
  const nonce = useMemo(() => Date.now().toString(), []);

  const back: Back = {
    nonce,
    market_id,
    close,
    end,
    odds: odds / 1000,
    proposition_id,
    signature: signature?.signature ?? ""
  };
  return { back };
};

type Props = {
  runner?: Runner;
};
const BackLogic = ({ runner }: Props) => {
  const { back } = usePageParams(runner);
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
