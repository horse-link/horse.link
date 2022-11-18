import ContractWriteResultCard from "../../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import Modal from "../../../components/Modal";
import RequireWalletButton from "../../../components/RequireWalletButton/RequireWalletButton_View";
import { BetHistory } from "../../../types";
import { Loader } from "../../../components";
import useMarkets from "../../../hooks/market/useMarkets";
import { useEffect, useState } from "react";
import useSettleContractWrite from "../../../hooks/market/useMarketSettle";
import useMarketOracleResultWrite from "../../../hooks/market/useMarketOracle";

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
    console.log(bet);
    const {
      setResultMarketOracleWrite,
      marketOracleError,
      isMarketOracleTxHashTxLoading,
      isMarketOracleTxHashTxSuccess,
      marketOracleTxHash
    } = useMarketOracleResultWrite({
      market_id: bet?.marketId,
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
        {data?.settled || settleTxStatus.isSuccess ? (
          <div className="text-3xl">Settled Bet</div>
        ) : (
          <div className="text-3xl">Settle Bet</div>
        )}
        <div className="flex flex-col">
          <label className="mt-2">
            <span>{`Bet Index: ${data?.index}`}</span>
          </label>
          {data?.winningPropositionId !== undefined && (
            <label className="mt-2">
              <span>{`Winning Bet: ${(
                data?.propositionId === data?.winningPropositionId
              ).toString()}`}</span>
            </label>
          )}
        </div>
        <br></br>

        {!data?.winningPropositionId && (
          <div>
            <span>This race has yet to complete. Please check back later.</span>
          </div>
        )}
        {data &&
          !data?.settled &&
          !data?.marketResultAdded &&
          data?.winningPropositionId &&
          !marketOracleTxStatus.isSuccess && (
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
                      marketOracleContract.setResultMarketOracleWrite?.()
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

        {!data?.settled &&
          !settleTxStatus.isSuccess &&
          (data?.marketResultAdded || marketOracleTxStatus.isSuccess) && (
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
                    onClick={() => settleContract.settleBetWrite?.()}
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
