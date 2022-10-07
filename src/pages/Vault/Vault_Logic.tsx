import { useState } from "react";
import { useParams } from "react-router-dom";
import VaultView from "./Vault_View";
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
import useVaultData from "../../hooks/useVaultData";
type useWithdrawContractWriteArgs = {
  vaultAddress: string;
  enabled: boolean;
};
const useWithdrawContractWrite = ({
  vaultAddress,
  enabled
}: useWithdrawContractWriteArgs) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi,
    functionName: "withdraw",
    enabled
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

const VaultLogic = () => {
  const { vaultAddress: vaultAddressParam } = useParams();
  const { address } = useAccount();
  const vaultAddress = vaultAddressParam ?? "";
  const userAddress = address ?? "";

  const {
    symbol,
    address: tokenAddress,
    decimals: tokenDecimal
  } = useTokenData(vaultAddress);
  const { userBalance: userBalanceStr } = useVaultData(
    vaultAddress,
    userAddress
  );
  const userBalance = Number(userBalanceStr);
  const [depositAmount, setDepositAmount] = useState(0);

  const {
    allowance,
    write: approveContractWrite,
    error: approveError,
    isTxLoading: isApproveTxLoading
  } = useTokenApproval(tokenAddress, userAddress, vaultAddress, tokenDecimal);

  const isEnoughAllowance = allowance > 0 && allowance >= depositAmount;

  const {
    write: depositContractWrite,
    error: depositError,
    isTxLoading: isDepositTxLoading,
    isTxSuccess: isDepositTxSuccess,
    txHash: depositTxHash
  } = useDepositContractWrite({
    depositAmount,
    tokenDecimal,
    ownerAddress: userAddress,
    vaultAddress,
    enabled: depositAmount > 0 && isEnoughAllowance
  });

  const {
    write: withdrawContractWrite,
    error: withdrawError,
    isTxLoading: isWithdrawTxLoading,
    isTxSuccess: isWithdrawTxSuccess,
    txHash: withdrawTxHash
  } = useWithdrawContractWrite({ vaultAddress, enabled: userBalance > 0 });

  const contract = {
    depositContractWrite,
    approveContractWrite,
    withdrawContractWrite,
    errorMsg: (approveError || depositError || withdrawError)?.message
  };
  const txStatus = {
    isLoading: isApproveTxLoading || isDepositTxLoading || isWithdrawTxLoading,
    isSuccess: isDepositTxSuccess || isWithdrawTxSuccess,
    hash: depositTxHash || withdrawTxHash
  };
  const updateDepositAmount = (amount: number) => {
    setDepositAmount(amount);
  };
  const shouldDepositButtonDisabled =
    depositAmount == 0 || !contract?.depositContractWrite || txStatus.isLoading;
  const shouldWithdrawButtonDisabled =
    Number(userBalance) == 0 ||
    !contract?.withdrawContractWrite ||
    txStatus.isLoading;
  return (
    <VaultView
      symbol={symbol}
      userBalance={userBalance}
      depositAmount={depositAmount}
      updateDepositAmount={updateDepositAmount}
      shouldDepositButtonDisabled={shouldDepositButtonDisabled}
      shouldWithdrawButtonDisabled={shouldWithdrawButtonDisabled}
      contract={contract}
      txStatus={txStatus}
      isEnoughAllowance={isEnoughAllowance}
    />
  );
};

export default VaultLogic;
