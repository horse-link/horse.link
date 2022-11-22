import { useContractWrite, useWaitForTransaction } from "wagmi";
import marketOracleContractJson from "../../abi/MarketOracle.json";
import { useConfig } from "../../providers/Config";
import { EcSignature } from "../../types";

type useMarketOracleResultWriteArgs = {
  marketAddress?: string;
  market_id?: string;
  winningPropositionId?: string;
  signature?: EcSignature;
};

const useMarketOracleResultWrite = ({
  market_id,
  winningPropositionId
}: useMarketOracleResultWriteArgs) => {
  const config = useConfig();

  const {
    data,
    error: marketOracleError,
    write: setResultMarketOracleWrite
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: config?.addresses?.marketOracle,
    abi: marketOracleContractJson.abi,
    functionName: "setResult",
    // TODO: Once we have switched the marketOracle contract to check EC signatures
    // We can just pass the signature as the last argument
    // For the moment we can just pass this blank signature to keep the contract happy
    args: [
      market_id,
      winningPropositionId,
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ]
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

export default useMarketOracleResultWrite;
