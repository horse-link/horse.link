import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import {
  Address,
  useAccount,
  useBalance,
  useContractWrite,
  useWaitForTransaction
} from "wagmi";

import marketContractJson from "../../../../abi/Market.json";
import usePotentialPayout from "../../../../hooks/bet/usePotentialPayout";
import useMarketDetail from "../../../../hooks/market/useMarketDetail";
import useMarkets from "../../../../hooks/market/useMarkets";
import useTokenApproval from "../../../../hooks/token/useTokenApproval";
import useTokenData from "../../../../hooks/token/useTokenData";
import { Back, EcSignature, Runner } from "../../../../types";
import BackView from "./Back_View";
import { useConfig } from "../../../../providers/Config";
import { getTokenBySymbol } from "../../../../utils/config";

const DECIMAL = 6;

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
    () => ethers.utils.parseUnits(odds.toString(), DECIMAL),
    [odds]
  );
  const bnWager = useMemo(
    () =>
      ethers.utils.parseUnits(debouncedWagerAmount.toString(), tokenDecimal),
    [debouncedWagerAmount, tokenDecimal]
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
  signature: EcSignature | undefined;
  enabled: boolean;
};

const useGetBackContractWrite = ({
  marketAddress,
  b32Nonce,
  b32PropositionId,
  b32MarketId,
  bnWager,
  bnOdds,
  close,
  end,
  signature
}: useBackContractWriteArgs) => {
  const {
    data: contractData,
    error,
    write
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: marketAddress,
    abi: marketContractJson.abi,
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
  const { odds, proposition_id } = back;

  const [debouncedWagerAmount] = useDebounce(wagerAmount, 500);

  const marketData = useMarketDetail(marketAddress);

  const vaultAddress = marketData?.vaultAddress.toString() ?? "";

  const { address: tokenAddress, decimals: tokenDecimal } = useTokenData({
    vaultAddress
  });

  const {
    allowance,
    write: approveContractWrite,
    error: approveError,
    isTxLoading: isApproveTxLoading
  } = useTokenApproval(
    tokenAddress as Address,
    ownerAddress as Address,
    marketAddress as Address,
    tokenDecimal
  );

  const isEnoughAllowance = allowance
    ? allowance > 0 && allowance >= wagerAmount
    : false;

  const { potentialPayout } = usePotentialPayout({
    marketAddress,
    propositionId: proposition_id,
    wager: debouncedWagerAmount,
    odds,
    tokenDecimal
  });

  return {
    potentialPayout,
    contract: {
      approveContractWrite,
      errorMsg: approveError?.message
    },
    isApproveTxLoading,
    isEnoughAllowance,
    tokenDecimal,
    debouncedWagerAmount,
    latestAllowance: allowance
  };
};

const usePageParams = (runner?: Runner) => {
  const {
    proposition_id = "",
    market_id = "",
    nonce = "",
    odds = 0,
    close = 0,
    end = 0,
    signature = { r: "", s: "", v: 0 }
  } = runner ?? {};

  const back: Back = {
    nonce,
    market_id,
    close,
    end,
    odds,
    proposition_id,
    signature
  };
  return { back };
};

type Props = {
  runner?: Runner;
  balanceData?: any;
};

const BackLogic: React.FC<Props> = ({ runner }) => {
  const config = useConfig();

  const { back } = usePageParams(runner);
  const { marketAddresses } = useMarkets();
  const { address } = useAccount();
  const ownerAddress = address ?? "";
  const [selectedMarketAddress, setSelectedMarketAddress] =
    useState<string>("");
  const [wagerAmount, setWagerAmount] = useState<number>(0);
  const [allowance, setAllowance] = useState<number | string>();

  const marketData = useMarketDetail(selectedMarketAddress);
  const { data: balanceData } = useBalance({
    address,
    token:
      marketData?.name && marketData.name.includes("DAI")
        ? getTokenBySymbol("DAI", config)?.address
        : getTokenBySymbol("USDT", config)?.address
  });

  useEffect(() => {
    if (marketAddresses.length > 0) {
      setSelectedMarketAddress(marketAddresses[0]);
    }
  }, [marketAddresses]);

  const {
    potentialPayout,
    contract,
    isApproveTxLoading,
    isEnoughAllowance,
    tokenDecimal,
    debouncedWagerAmount,
    latestAllowance
  } = useBackingContract(
    back,
    wagerAmount,
    selectedMarketAddress,
    ownerAddress
  );

  useEffect(() => {
    if (latestAllowance) {
      setAllowance(latestAllowance);
    }
  }, [latestAllowance]);

  const { nonce, odds, proposition_id, market_id, close, end, signature } =
    back;
  const { b32PropositionId, bnWager, bnOdds, b32Nonce, b32MarketId } =
    usePrepareBackingData(
      proposition_id,
      odds,
      tokenDecimal,
      debouncedWagerAmount,
      nonce,
      market_id
    );

  const {
    write: backContractWrite,
    isTxLoading: isBackTxLoading,
    isTxSuccess: isBackTxSuccess,
    backTxHash
  } = useGetBackContractWrite({
    marketAddress: selectedMarketAddress,
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

  const shouldButtonDisabled =
    wagerAmount == 0 ||
    !backContractWrite ||
    isApproveTxLoading ||
    isBackTxLoading;

  const handleSetSelectedMarketAddress = (address: string) => {
    setSelectedMarketAddress(address);
    setAllowance(undefined);
  };

  const txStatuses = {
    isLoading: isBackTxLoading || isApproveTxLoading,
    isSuccess: isBackTxSuccess,
    hash: backTxHash
  };

  return (
    <BackView
      back={back}
      markets={marketAddresses}
      selectedMarket={selectedMarketAddress}
      setSelectedMarket={handleSetSelectedMarketAddress}
      wagerAmount={wagerAmount}
      updateWagerAmount={amount => setWagerAmount(amount || 0)}
      potentialPayout={potentialPayout}
      shouldButtonDisabled={shouldButtonDisabled}
      contract={contract}
      txStatus={txStatuses}
      isEnoughAllowance={isEnoughAllowance}
      allowance={allowance}
      backContractWrite={backContractWrite}
      balanceData={balanceData}
    />
  );
};

export default BackLogic;
