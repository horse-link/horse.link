import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";
import ContractWriteResultCard from "../../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import Modal from "../../../components/Modal";
import RequireWalletButton from "../../../components/RequireWalletButton/RequireWalletButton_View";
import marketContractJson from "../../../abi/Market.json";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
const BetModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <SettleBet />
    </Modal>
  );
};

export default BetModal;

type useSettleContractWriteArgs = {
  marketAddress: string;
  id: string;
  signature: string;
};
const useSettleContractWrite = ({
  marketAddress,
  id,
  signature
}: useSettleContractWriteArgs) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: marketAddress,
    contractInterface: marketContractJson.abi,
    functionName: "settle",
    args: [id, signature],
    enabled: !!id && !!signature
  });
  const { data, error: writeError, write } = useContractWrite(config);

  const txHash = data?.hash;
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: txHash
    });
  return {
    write,
    error: prepareError || writeError,
    isTxLoading,
    isTxSuccess,
    txHash
  };
};

const useSettleBet = () => {
  // TODO: get args from props
  const marketAddress = "0xe9BC1f42bF75C59b245d39483E97C3A70c450c9b";
  const propositionId = "";
  const signature = "";
  const {
    write: settleContractWrite,
    error: settleError,
    isTxLoading,
    isTxSuccess,
    txHash
  } = useSettleContractWrite({
    marketAddress,
    id: propositionId,
    signature
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
const SettleBet = () => {
  const { contract, txStatus, shouldSettleButtonDisabled } = useSettleBet();
  return (
    <div className="w-96 md:w-152">
      <div className="px-10 pt-5 pb-5 rounded-md bg-white border-gray-200 sm:rounded-lg">
        <div className="text-3xl">Target odds</div>
        <form>
          <div className="flex flex-col">
            <label>
              <span>id</span>
              <input
                type="text"
                value="{{propositionId}}"
                readOnly
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>

            <label>
              <span>signature</span>
              <input
                type="text"
                value="{{signature}}"
                readOnly
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
          </div>
          <br></br>
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
                  disabled={shouldSettleButtonDisabled}
                >
                  {txStatus.isLoading ? "..." : "Settle"}
                </button>
              }
            />
          </div>
        </form>
      </div>
      <div className="mt-5">
        <ContractWriteResultCard
          hash={txStatus.hash}
          isSuccess={txStatus.isSuccess}
          errorMsg={contract.errorMsg}
        />
      </div>
    </div>
  );
};
