import { useState } from "react";
import VaultView from "./Vault_View";
import vaultContractJson from "../../../../abi/Vault.json";
import {
  Address,
  useAccount,
  useContractWrite,
  useWaitForTransaction
} from "wagmi";
import { ethers } from "ethers";
import useTokenData from "../../../../hooks/token/useTokenData";
import useTokenApproval from "../../../../hooks/token/useTokenApproval";
import useVaultUserData from "../../../../hooks/vault/useVaultUserData";

type useWithdrawContractWriteArgs = {
  amount: number;
  tokenDecimal: string;
  vaultAddress: string;
  enabled: boolean;
  onTxSuccess: () => void;
};

const useWithdrawContractWrite = ({
  amount,
  tokenDecimal,
  vaultAddress,
  onTxSuccess
}: useWithdrawContractWriteArgs) => {
  const assets = ethers.utils.parseUnits(amount.toString(), tokenDecimal);

  const { data, error, write } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: vaultAddress,
    abi: vaultContractJson,
    functionName: "withdraw",
    args: [assets]
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
  amount: number;
  tokenDecimal: string;
  ownerAddress: string;
  vaultAddress: string;
  enabled: boolean;
  onTxSuccess: () => void;
};

const useDepositContractWrite = ({
  amount,
  tokenDecimal,
  ownerAddress,
  vaultAddress,
  onTxSuccess
}: useDepositContractWriteArgs) => {
  const assets = ethers.utils.parseUnits(amount.toString(), tokenDecimal);
  const receiver = ownerAddress;

  const { data, error, write } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: vaultAddress,
    abi: vaultContractJson,
    functionName: "deposit",
    args: [assets, receiver]
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
  } = useTokenData({ vaultAddress });
  const {
    vaultBalance,
    userBalance: userBalanceStr,
    performance,
    asset,
    refetch: refetchVaultUserData
  } = useVaultUserData({ vaultAddress, userAddress });
  const userBalance = Number(userBalanceStr);
  const [amount, setAmount] = useState(0);

  const {
    allowance,
    write: approveContractWrite,
    error: approveError,
    isTxLoading: isApproveTxLoading
  } = useTokenApproval(
    tokenAddress as Address,
    userAddress as Address,
    vaultAddress as Address,
    tokenDecimal
  );

  const isEnoughAllowance = allowance
    ? allowance > 0 && allowance >= amount
    : false;

  const {
    write: depositContractWrite,
    error: depositError,
    isTxLoading: isDepositTxLoading,
    isTxSuccess: isDepositTxSuccess,
    txHash: depositTxHash
  } = useDepositContractWrite({
    amount,
    tokenDecimal,
    ownerAddress: userAddress,
    vaultAddress,
    enabled: amount > 0 && isEnoughAllowance,
    onTxSuccess: () => refetchVaultUserData()
  });

  const {
    write: withdrawContractWrite,
    error: withdrawError,
    isTxLoading: isWithdrawTxLoading,
    isTxSuccess: isWithdrawTxSuccess,
    txHash: withdrawTxHash
  } = useWithdrawContractWrite({
    amount,
    tokenDecimal,
    vaultAddress,
    enabled: userBalance > 0,
    onTxSuccess: () => refetchVaultUserData()
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
  const updateAmount = (amount: number) => {
    setAmount(amount);
  };
  const shouldDepositButtonDisabled =
    amount == 0 || !contract?.depositContractWrite || txStatus.isLoading;
  const shouldWithdrawButtonDisabled =
    Number(userBalance) == 0 ||
    !contract?.withdrawContractWrite ||
    txStatus.isLoading;

  const vaultDetailData = {
    userAddress,
    tokenSymbol,
    vaultAddress,
    vaultBalance,
    userBalance: userBalanceStr,
    performance,
    asset
  };
  return (
    <VaultView
      vaultDetailData={vaultDetailData}
      userBalance={userBalance}
      depositAmount={amount}
      updateAmount={updateAmount}
      shouldDepositButtonDisabled={shouldDepositButtonDisabled}
      shouldWithdrawButtonDisabled={shouldWithdrawButtonDisabled}
      contract={contract}
      txStatus={txStatus}
      isEnoughAllowance={isEnoughAllowance}
    />
  );
};

export default VaultLogic;
