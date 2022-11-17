import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import api from "../../../../apis/Api";

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

  const isEnoughAllowance = allowance > 0 && allowance >= wagerAmount;

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
    debouncedWagerAmount
  };
};

const usePageParams = (runner?: Runner) => {
  const {
    proposition_id = "",
    market_id = "",
    odds = 0,
    close = 0,
    end = 0
  } = runner ?? {};

  // todo: get nonce from runner once api is updated
  const nonce = useMemo(() => Date.now().toString(), []);

  const back: Back = {
    nonce,
    market_id,
    close,
    end,
    odds: odds / 1000,
    proposition_id
  };
  return { back };
};

type Props = {
  runner?: Runner;
  balanceData?: any;
};

const BackLogic: React.FC<Props> = ({ runner }) => {
  const { back } = usePageParams(runner);
  const { marketAddresses } = useMarkets();
  const { address } = useAccount();
  const ownerAddress = address ?? "";
  const [selectedMarketAddress, setSelectedMarketAddress] = useState<string>(
    "0xA0f8A6eD9Df461541159Fa5f083082A6f6E0f795"
  );
  const [wagerAmount, setWagerAmount] = useState<number>(0);
  const [signature, setSignature] = useState<EcSignature>();
  const config = useConfig();

  const marketData = useMarketDetail(selectedMarketAddress);
  const { data: balanceData } = useBalance({
    address: address,
    token:
      marketData?.name && marketData.name.includes("DAI")
        ? (config?.tokenAddresses.DAI as Address)
        : (config?.tokenAddresses.USDT as Address)
  });

  useEffect(() => {
    if (marketAddresses.length > 0) {
      setSelectedMarketAddress(marketAddresses[0]);
    }
  }, [marketAddresses]);

  useEffect(() => {
    if (signature) {
      backContractWrite?.();
    }
  }, [signature]);

  const {
    potentialPayout,
    contract,
    isApproveTxLoading,
    isEnoughAllowance,
    tokenDecimal,
    debouncedWagerAmount
  } = useBackingContract(
    back,
    wagerAmount,
    selectedMarketAddress,
    ownerAddress
  );

  const { nonce, odds, proposition_id, market_id, close, end } = back;
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

  const handleBackContractWrite = async () => {
    try {
      const res = await api.requestBackingSign(
        b32Nonce,
        b32PropositionId,
        b32MarketId,
        bnWager,
        bnOdds,
        close,
        end
      );

      const { signature } = res;
      setSignature(signature);
    } catch (error: any) {
      alert(error?.message ?? "Something went wrong");
    }
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
      setSelectedMarket={setSelectedMarketAddress}
      wagerAmount={wagerAmount}
      updateWagerAmount={amount => setWagerAmount(amount || 0)}
      potentialPayout={potentialPayout}
      shouldButtonDisabled={shouldButtonDisabled}
      contract={contract}
      txStatus={txStatuses}
      isEnoughAllowance={isEnoughAllowance}
      handleBackContractWrite={handleBackContractWrite}
      balanceData={balanceData}
    />
  );
};

export default BackLogic;
