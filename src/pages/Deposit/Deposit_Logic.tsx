import { useState } from "react";
import { useParams } from "react-router-dom";
import DepositView from "./Deposit_View";
import vaultContractJson from "../../abi/Vault.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";
import { ethers } from "ethers";
import useTokenData from "../../hooks/useTokenData";
import useTokenApproval from "../../hooks/useTokenApproval";

type useDepositContractWriteArgs = {
  depositAmount: number;
  tokenDecimal: string;
  ownerAddress: string;
  vaultAddress: string;
  enabled: boolean;
};
const useDepositContractWrite = ({
  depositAmount,
  tokenDecimal,
  ownerAddress,
  vaultAddress,
  enabled
}: useDepositContractWriteArgs) => {
  const assets = ethers.utils.parseUnits(
    depositAmount.toString(),
    tokenDecimal
  );
  const receiver = ownerAddress;
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi,
    functionName: "deposit",
    args: [assets, receiver],
    enabled
  });

  const {
    data: depositData,
    error: writeError,
    write
  } = useContractWrite(config);

  const depositTxHash = depositData?.hash;

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: depositTxHash
    });

  return {
    write,
    error: prepareError || writeError,
    isTxLoading,
    isTxSuccess,
    depositTxHash
  };
};

const DepositLogic = () => {
  const { vaultAddress: vaultAddressParam } = useParams();
  const { address } = useAccount();
  const vaultAddress = vaultAddressParam ?? "";
  const ownerAddress = address ?? "";

  const {
    symbol,
    address: tokenAddress,
    decimals: tokenDecimal
  } = useTokenData(vaultAddress);
  const [depositAmount, setDepositAmount] = useState(0);

  const {
    allowance,
    write: approveContractWrite,
    error: approveError,
    isTxLoading: isApproveTxLoading
  } = useTokenApproval(tokenAddress, ownerAddress, vaultAddress, tokenDecimal);

  const isEnoughAllowance = allowance > 0 && allowance >= depositAmount;

  const {
    write: depositContractWrite,
    error: depositError,
    isTxLoading: isDepositTxLoading,
    isTxSuccess: isDepositTxSuccess,
    depositTxHash
  } = useDepositContractWrite({
    depositAmount,
    tokenDecimal,
    ownerAddress,
    vaultAddress,
    enabled: depositAmount > 0 && isEnoughAllowance
  });

  const contract = {
    depositContractWrite,
    approveContractWrite,
    errorMsg: (depositError || approveError)?.message
  };
  const txStatus = {
    isLoading: isDepositTxLoading || isApproveTxLoading,
    isSuccess: isDepositTxSuccess,
    hash: depositTxHash
  };
  const updateDepositAmount = (amount: number) => {
    setDepositAmount(amount);
  };
  const shouldDepositButtonDisabled =
    depositAmount == 0 || !contract?.depositContractWrite || txStatus.isLoading;
  return (
    <DepositView
      symbol={symbol}
      depositAmount={depositAmount}
      updateDepositAmount={updateDepositAmount}
      shouldDepositButtonDisabled={shouldDepositButtonDisabled}
      contract={contract}
      txStatus={txStatus}
      isEnoughAllowance={isEnoughAllowance}
    />
  );
};

export default DepositLogic;
