import { useContractWrite, useWaitForTransaction } from "wagmi";
import ContractWriteResultCard from "../../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import Modal from "../../../components/Modal";
import RequireWalletButton from "../../../components/RequireWalletButton/RequireWalletButton_View";
import marketContractJson from "../../../abi/Market.json";
import marketOracleContractJson from "../../../abi/MarketOracle.json";
import { BetHistory } from "../../../types";
import { Loader } from "../../../components";
import useMarkets from "../../../hooks/market/useMarkets";
import { useEffect, useState } from "react";
import { EcSignature } from "../../../types/index";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  betData?: BetHistory;
};
const BetModal = ({ isOpen, onClose, betData }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <SettleBet data={betData} />
    </Modal>
  );
};

export default BetModal;

type useSettleContractWriteArgs = {
  marketAddress?: string;
  index?: number;
  raceResult?: boolean;
  signature?: EcSignature;
};
const useSettleContractWrite = ({
  marketAddress,
  index
}: useSettleContractWriteArgs) => {
  const {
    data,
    error: settleBetError,
    write: settleBetWrite
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: marketAddress || "",
    abi: marketContractJson.abi,
    functionName: "settle",
    args: [index]
  });

  const settleBetTxHash = data?.hash;
  const { isLoading: isSettleBetTxLoading, isSuccess: isSettleBetTxSuccess } =
    useWaitForTransaction({
      hash: settleBetTxHash
    });
  return {
    settleBetWrite,
    settleBetError,
    isSettleBetTxLoading,
    isSettleBetTxSuccess,
    settleBetTxHash
  };
};

type useMarketOracleResultWriteArgs = {
  marketAddress?: string;
  market_id?: string;
  winningPropositionId?: string;
  signature?: EcSignature;
};
const useMarketOracleResultWrite = ({
  market_id,
  winningPropositionId,
  signature
}: useMarketOracleResultWriteArgs) => {
  const {
    data,
    error: marketOracleError,
    write: setResultMarketOracleWrite
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName:
      process.env.REACT_APP_MARKET_ORACLE_CONTRACT ||
      "0x592a44ebad029EBFff3Ee4950f1E74538a19a2ea",
    contractInterface: marketOracleContractJson.abi,
    functionName: "setResult",
    // TODO: Once we have switched the marketOracle contract to check EC signatures
    // We can just pass the signature as the last argument
    // For the moment we can just pass this blank signature to keep the contract happy
    args: [
      market_id,
      winningPropositionId,
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ],
    enabled: !!market_id && !!winningPropositionId && !!signature
  });

  const marketOracleTxHash = data?.hash;
  const {
    isLoading: isMarketOracleTxHashTxLoading,
    isSuccess: isMarketOracleTxHashTxSuccess
  } = useWaitForTransaction({
    hash: marketOracleTxHash
  });
  return {
    setResultMarketOracleWrite,
    marketOracleError,
    isMarketOracleTxHashTxLoading,
    isMarketOracleTxHashTxSuccess,
    marketOracleTxHash
  };
};

type SettlebetProps = {
  data?: BetHistory;
};
const SettleBet = ({ data }: SettlebetProps) => {
  const { marketAddresses } = useMarkets();

  const [selectedMarketAddress, setSelectedMarketAddress] = useState<string>(
    "0x1514b66a40CA2D600bB4Cf35A735709a1972c2F3"
  );

  useEffect(() => {
    if (marketAddresses.length > 0) {
      setSelectedMarketAddress(marketAddresses[0]);
    }
  }, [marketAddresses]);

  const useMarketOracle = (bet?: BetHistory) => {
    const {
      setResultMarketOracleWrite,
      marketOracleError,
      isMarketOracleTxHashTxLoading,
      isMarketOracleTxHashTxSuccess,
      marketOracleTxHash
    } = useMarketOracleResultWrite({
      market_id: bet?.market_id,
      winningPropositionId: bet?.winningPropositionId,
      signature: bet?.marketOracleResultSig
    });
    const marketOracleContract = {
      setResultMarketOracleWrite,
      errorMsg: marketOracleError?.message
    };
    const marketOracleTxStatus = {
      isLoading: isMarketOracleTxHashTxLoading,
      isSuccess: isMarketOracleTxHashTxSuccess,
      hash: marketOracleTxHash
    };

    const shouldMarketOracleButtonDisabled =
      !marketOracleContract.setResultMarketOracleWrite;

    return {
      marketOracleContract,
      marketOracleTxStatus,
      shouldMarketOracleButtonDisabled
    };
  };

  const useSettleBet = (bet?: BetHistory) => {
    const {
      settleBetWrite,
      settleBetError,
      isSettleBetTxLoading,
      isSettleBetTxSuccess,
      settleBetTxHash
    } = useSettleContractWrite({
      marketAddress: selectedMarketAddress,
      index: bet?.index
    });
    const settleContract = {
      settleBetWrite,
      errorMsg: settleBetError?.message
    };
    const settleTxStatus = {
      isLoading: isSettleBetTxLoading,
      isSuccess: isSettleBetTxSuccess,
      hash: settleBetTxHash
    };

    const shouldSettleButtonDisabled = !settleContract.settleBetWrite;

    return {
      settleContract,
      settleTxStatus,
      shouldSettleButtonDisabled
    };
  };

  //const data?.marketOracleResultSig
  const { settleContract, settleTxStatus, shouldSettleButtonDisabled } =
    useSettleBet(data);

  const {
    marketOracleContract,
    marketOracleTxStatus,
    shouldMarketOracleButtonDisabled
  } = useMarketOracle(data);

  const txStatuses = {
    isLoading: settleTxStatus.isLoading || marketOracleTxStatus.isLoading,
    isSuccess: settleTxStatus.isSuccess || marketOracleTxStatus.isSuccess,
    hash: settleTxStatus.hash || marketOracleTxStatus.hash
  };

  return (
    <div className="w-96 md:w-152">
      <div className="px-10 pt-5 pb-5 rounded-md bg-white border-gray-200 sm:rounded-lg">
        {data?.settled ? (
          <div className="text-3xl">Settled Bet</div>
        ) : (
          <div className="text-3xl">Settle Bet</div>
        )}
        <div className="flex flex-col">
          <label>
            <span>Bet Index</span>
            <input
              type="text"
              value={data?.index}
              readOnly
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          {data?.winningPropositionId !== undefined && (
            <label>
              <span>Winning Bet</span>
              <input
                type="text"
                value={(
                  data?.proposition_id === data?.winningPropositionId
                ).toString()}
                readOnly
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
          )}
        </div>
        <br></br>

        {data &&
          !data?.settled &&
          !data?.marketResultAdded &&
          data?.winningPropositionId && (
            <div className="flex flex-col">
              <RequireWalletButton
                actionButton={
                  <button
                    className={
                      "px-5 py-1 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md" +
                      (shouldSettleButtonDisabled
                        ? " opacity-50 cursor-not-allowed"
                        : "")
                    }
                    onClick={() =>
                      marketOracleContract.setResultMarketOracleWrite()
                    }
                    disabled={shouldMarketOracleButtonDisabled}
                  >
                    {marketOracleTxStatus.isLoading ? (
                      <Loader />
                    ) : (
                      "Submit Result"
                    )}
                  </button>
                }
              />
            </div>
          )}

        {!data?.settled && data?.marketResultAdded && (
          <div className="flex flex-col">
            <RequireWalletButton
              actionButton={
                <button
                  className={
                    "px-5 py-1 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md" +
                    (shouldSettleButtonDisabled
                      ? " opacity-50 cursor-not-allowed"
                      : "")
                  }
                  onClick={() => settleContract.settleBetWrite()}
                  disabled={shouldSettleButtonDisabled}
                >
                  {settleTxStatus.isLoading ? <Loader /> : "Settle"}
                </button>
              }
            />
          </div>
        )}

        <div className="mt-5">
          <ContractWriteResultCard
            hash={txStatuses.hash}
            isSuccess={txStatuses.isSuccess}
            errorMsg={settleContract.errorMsg}
          />
        </div>
      </div>
    </div>
  );
};
