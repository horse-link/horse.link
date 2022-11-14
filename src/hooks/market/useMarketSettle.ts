import { useContractWrite, useWaitForTransaction } from "wagmi";
import marketContractJson from "../../abi/Market.json";
import { EcSignature } from "../../types";

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

export default useSettleContractWrite;
