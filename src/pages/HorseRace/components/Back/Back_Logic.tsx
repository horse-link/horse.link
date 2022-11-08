import { BigNumberish, ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import api from "../../../../apis/Api";

import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";

import marketContractJson from "../../../../abi/Market.json";
import usePotentialPayout from "../../../../hooks/bet/usePotentialPayout";
import useMarketDetail from "../../../../hooks/market/useMarketDetail";
import useMarkets from "../../../../hooks/market/useMarkets";
import useTokenApproval from "../../../../hooks/token/useTokenApproval";
import useTokenData from "../../../../hooks/token/useTokenData";
import { Back, Runner } from "../../../../types";
import BackView from "./Back_View";

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
      // TODO: Remove this once the contract requires a sig to back
      {
        v: 28,
        r: "0x64779ba2fcec4b635c6a96f01dde74bd466cc0602fecc95c34d8edb5c205a0d3",
        s: "0x7044254596476e91d0f1fb41967ed45ebcc7e7b973c81a10bc008ca294e2c2d5"
      }
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
  } = useTokenApproval(tokenAddress, ownerAddress, marketAddress, tokenDecimal);

  const isEnoughAllowance = allowance > 0 && allowance >= wagerAmount;

  const { potentialPayout } = usePotentialPayout({
    marketAddress,
    propositionId: proposition_id,
    wager: debouncedWagerAmount,
    odds,
    tokenDecimal
  });

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

const BackLogic: React.FC<Props> = ({ runner }) => {
  const { back } = usePageParams(runner);
  const { marketAddresses } = useMarkets();
  const { address } = useAccount();
  const ownerAddress = address ?? "";
  const [selectedMarketAddress, setSelectedMarketAddress] = useState<string>(
    "0x1514b66a40CA2D600bB4Cf35A735709a1972c2F3"
  );
  useEffect(() => {
    if (marketAddresses.length > 0) {
      setSelectedMarketAddress(marketAddresses[0]);
    }
  }, [marketAddresses]);

  const [wagerAmount, setWagerAmount] = useState<number>(0);
  const {
    potentialPayout,
    contract,
    txStatus,
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

  const shouldButtonDisabled =
    wagerAmount == 0 || !contract?.backContractWrite || txStatus.isLoading;

  // Do this like the faucet
  const handleBackContractWrite = async () => {
    try {
      console.log(
        proposition_id,
        odds,
        tokenDecimal,
        debouncedWagerAmount,
        nonce,
        market_id
      );
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
      console.log("signature", signature);
    } catch (error: any) {
      alert(error?.message ?? "Something went wrong");
    }
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
      txStatus={txStatus}
      isEnoughAllowance={isEnoughAllowance}
      handleBackContractWrite={handleBackContractWrite}
    />
  );
};

export default BackLogic;
