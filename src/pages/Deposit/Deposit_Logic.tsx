import { useState } from "react";
import { useParams } from "react-router-dom";
import DepositView from "./Deposit_View";
import vaultContractJson from "../../abi/Vault.json";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";

const DepositLogic = () => {
  const { vaultAddress } = useParams();
  const [depositAmount, setDepositAmount] = useState(0);
  const { address } = useAccount();
  const vaultContract = {
    addressOrName: vaultAddress || "",
    contractInterface: vaultContractJson.abi
  };
  const { data: vaultSymbol } = useContractRead({
    ...vaultContract,
    functionName: "symbol"
  });

  const assets = depositAmount;
  const receiver = address;
  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    ...vaultContract,
    functionName: "deposit",
    args: [assets, receiver]
  });

  const {
    data: contractData,
    error,
    isError,
    write: contractWrite
  } = useContractWrite(config);

  const txHash = contractData?.hash;

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: txHash
    });

  const contract = {
    write: contractWrite,
    isError: depositAmount > 0 && (isPrepareError || isError),
    errorMsg: (prepareError || error)?.message
  };
  const txStatus = {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    hash: txHash
  };
  const symbol = vaultSymbol?.toString() ?? "";
  const updateDepositAmount = (amount: number) => {
    setDepositAmount(amount);
  };
  const shouldButtonDisabled =
    depositAmount == 0 || !contract.write || txStatus.isLoading;
  return (
    <DepositView
      symbol={symbol}
      depositAmount={depositAmount}
      updateDepositAmount={updateDepositAmount}
      shouldButtonDisabled={shouldButtonDisabled}
      contract={contract}
      txStatus={txStatus}
    />
  );
};

export default DepositLogic;
