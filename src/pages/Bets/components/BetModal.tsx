import { useContractWrite, useWaitForTransaction } from "wagmi";
import ContractWriteResultCard from "../../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import Modal from "../../../components/Modal";
import RequireWalletButton from "../../../components/RequireWalletButton/RequireWalletButton_View";
import marketContractJson from "../../../abi/Market.json";
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
  const { data, error, write } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: marketAddress || "",
    abi: marketContractJson.abi,
    functionName: "settle",
    args: [index]
  });

  const txHash = data?.hash;
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: txHash
    });
  return {
    write,
    error,
    isTxLoading,
    isTxSuccess,
    txHash
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
  const { data, error, write } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName:
      process.env.REACT_APP_MARKET_ORACLE_CONTRACT ||
      "0x592a44ebad029EBFff3Ee4950f1E74538a19a2ea",
    contractInterface: marketContractJson.abi,
    functionName: "setResult",
    args: [market_id, winningPropositionId, signature],
    enabled: !!market_id && !!winningPropositionId && !!signature
  });

  const txHash = data?.hash;
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: txHash
    });
  return {
    write,
    error,
    isTxLoading,
    isTxSuccess,
    txHash
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

  const useSettleBet = (bet?: BetHistory) => {
    const {
      write: settleContractWrite,
      error: settleError,
      isTxLoading,
      isTxSuccess,
      txHash
    } = useSettleContractWrite({
      marketAddress: selectedMarketAddress,
      index: bet?.index
    });
    const contract = {
      settleContractWrite,
      errorMsg: settleError?.message
    };
    const txStatus = {
      isLoading: isTxLoading,
      isSuccess: isTxSuccess,
      hash: txHash
    };

    const shouldSettleButtonDisabled = !contract.settleContractWrite;

    return {
      contract,
      txStatus,
      shouldSettleButtonDisabled
    };
  };

  //const data?.marketOracleResultSig
  const { contract, txStatus, shouldSettleButtonDisabled } = useSettleBet(data);
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
                  onClick={() => contract.settleContractWrite()}
                  disabled={shouldSettleButtonDisabled}
                >
                  {txStatus.isLoading ? <Loader /> : "Settle"}
                </button>
              }
            />
          </div>
        )}

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
                    onClick={() => contract.settleContractWrite()}
                    disabled={shouldSettleButtonDisabled}
                  >
                    {txStatus.isLoading ? <Loader /> : "Submit Result"}
                  </button>
                }
              />
            </div>
          )}

        <div className="mt-5">
          <ContractWriteResultCard
            hash={txStatus.hash}
            isSuccess={txStatus.isSuccess}
            errorMsg={contract.errorMsg}
          />
        </div>
      </div>
    </div>
  );
};
