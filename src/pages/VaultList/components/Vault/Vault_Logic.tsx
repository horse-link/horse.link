import { useState } from "react";
import { useParams } from "react-router-dom";
import VaultView from "./Vault_View";
import vaultContractJson from "../../../../abi/Vault.json";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { ethers } from "ethers";
import useTokenData from "../../../../hooks/useTokenData";
import useTokenApproval from "../../../../hooks/useTokenApproval";
import useVaultData from "../../../../hooks/useVaultData";
type useWithdrawContractWriteArgs = {
  vaultAddress: string;
  enabled: boolean;
  onTxSuccess: () => void;
};
const useWithdrawContractWrite = ({
  vaultAddress,
  enabled,
  onTxSuccess
}: useWithdrawContractWriteArgs) => {
  const { data, error, write } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi,
    functionName: "withdraw",
    enabled
  });

  const txHash = data?.hash;

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: txHash,
      onSuccess: onTxSuccess
    });

  return {
    write,
    error,
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
  onTxSuccess: () => void;
};
const useDepositContractWrite = ({
  depositAmount,
  tokenDecimal,
  ownerAddress,
  vaultAddress,
  enabled,
  onTxSuccess
}: useDepositContractWriteArgs) => {
  const assets = ethers.utils.parseUnits(
    depositAmount.toString(),
    tokenDecimal
  );
  const receiver = ownerAddress;

  const { data, error, write } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi,
    functionName: "deposit",
    args: [assets, receiver],
    enabled
  });

  const txHash = data?.hash;
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransaction({
      hash: txHash,
      onSuccess: onTxSuccess
    });

  return {
    write,
    error,
    isTxLoading,
    isTxSuccess,
    txHash
  };
};

type Props = {
  vaultAddress: string;
};
const VaultLogic = ({ vaultAddress }: Props) => {
  const { address } = useAccount();
  const userAddress = address ?? "";

  const {
    symbol: tokenSymbol,
    address: tokenAddress,
    decimals: tokenDecimal
  } = useTokenData(vaultAddress);
  const {
    vaultBalance,
    userBalance: userBalanceStr,
    performance,
    _asset,
    refetch: refetchVaultData
  } = useVaultData(vaultAddress, userAddress);
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
    enabled: depositAmount > 0 && isEnoughAllowance,
    onTxSuccess: () => refetchVaultData()
  });

  const {
    write: withdrawContractWrite,
    error: withdrawError,
    isTxLoading: isWithdrawTxLoading,
    isTxSuccess: isWithdrawTxSuccess,
    txHash: withdrawTxHash
  } = useWithdrawContractWrite({
    vaultAddress,
    enabled: userBalance > 0,
    onTxSuccess: () => refetchVaultData()
  });

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

  const vaultDetailData = {
    tokenSymbol: tokenSymbol,
    vaultAddress: vaultAddress,
    vaultBalance: vaultBalance,
    userBalance: userBalanceStr,
    performance: performance,
    asset: _asset
  };
  return (
    <VaultView
      vaultDetailData={vaultDetailData}
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
