import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DepositView from "./Deposit_View";
import vaultContractJson from "../../abi/Vault.json";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";
import { ethers } from "ethers";

const useTokenData = (vaultAddress: string) => {
  const { data: vaultData } = useContractRead({
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi,
    functionName: "asset"
  });
  const tokenAddress = vaultData?.toString() ?? "";
  const { data: tokenData } = useContractReads({
    contracts: [
      {
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: "symbol"
      },

      {
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: "decimals"
      }
    ]
  });

  const [tokenSymbol, decimals] = tokenData || [];

  return {
    symbol: tokenSymbol?.toString() ?? "",
    address: tokenAddress,
    decimals: decimals?.toString() ?? 0
  };
};

type useAllowanceArgs = {
  address: string;
  owner: string;
  spender: string;
  decimals: string;
};
const useAllowance = ({
  address,
  owner,
  spender,
  decimals
}: useAllowanceArgs) => {
  const { data: bnAllowance, refetch } = useContractRead({
    addressOrName: address,
    contractInterface: erc20ABI,
    functionName: "allowance",
    args: [owner, spender]
  });
  const allowance = useMemo(() => {
    if (!bnAllowance) return "0";
    return Number(ethers.utils.formatUnits(bnAllowance, decimals));
  }, [bnAllowance]);
  return { allowance, refetch };
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

type useApproveContractWriteArgs = {
  tokenAddress: string;
  vaultAddress: string;
  onTxSuccess: () => void;
};

const useApproveContractWrite = ({
  tokenAddress,
  vaultAddress,
  onTxSuccess
}: useApproveContractWriteArgs) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [vaultAddress, ethers.constants.MaxUint256]
  });

  const {
    data: approveData,
    write,
    error: writeError
  } = useContractWrite(config);

  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: onTxSuccess
  });

  return { write, error: prepareError || writeError, isTxLoading };
};

const DepositLogic = () => {
  const { vaultAddress: vaultAddressParam } = useParams();
  const { address } = useAccount();
  const vaultAddress = vaultAddressParam || "";
  const ownerAddress = address || "";

  const {
    symbol,
    address: tokenAddress,
    decimals: tokenDecimal
  } = useTokenData(vaultAddress);
  const [depositAmount, setDepositAmount] = useState(0);

  const { allowance, refetch: refetchAllowance } = useAllowance({
    address: tokenAddress,
    owner: ownerAddress,
    spender: vaultAddress,
    decimals: tokenDecimal
  });
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

  const {
    write: approveContractWrite,
    error: approveError,
    isTxLoading: isApproveTxLoading
  } = useApproveContractWrite({
    tokenAddress,
    vaultAddress,
    onTxSuccess: () => refetchAllowance()
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
