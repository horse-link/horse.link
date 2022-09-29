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

  const assets = ethers.utils.parseUnits(
    depositAmount.toString(),
    tokenDecimal
  );
  const receiver = ownerAddress;
  const {
    config: depositConfig,
    error: prepareDepositError,
    isError: isPrepareDepositError
  } = usePrepareContractWrite({
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi,
    functionName: "deposit",
    args: [assets, receiver]
  });

  const {
    data: depositData,
    error: depositError,
    isError: isDepositError,
    write: depositContractWrite
  } = useContractWrite(depositConfig);

  const depositTxHash = depositData?.hash;

  const { isLoading: isDepositTxLoading, isSuccess: isDepositTxSuccess } =
    useWaitForTransaction({
      hash: depositTxHash
    });

  const {
    config: approveConfig,
    isError: isPrepareApproveError,
    error: prepareApproveError
  } = usePrepareContractWrite({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [vaultAddress, ethers.constants.MaxUint256]
  });

  const {
    data: approveData,
    write: approveContractWrite,
    isError: isApproveError,
    error: approveError
  } = useContractWrite(approveConfig);

  const { isLoading: isApproveTxLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => refetchAllowance()
  });
  const shouldShowError = isEnoughAllowance && depositAmount > 0;
  const contract = {
    depositContractWrite,
    approveContractWrite,
    isError:
      shouldShowError &&
      (isPrepareDepositError ||
        isDepositError ||
        isPrepareApproveError ||
        isApproveError),
    errorMsg: (
      prepareDepositError ||
      depositError ||
      prepareApproveError ||
      approveError
    )?.message
  };
  const txStatus = {
    isLoading: isDepositTxLoading || isApproveTxLoading,
    isSuccess: isDepositTxSuccess,
    hash: depositTxHash
  };
  const updateDepositAmount = (amount: number) => {
    setDepositAmount(amount);
  };
  const shouldButtonDisabled =
    depositAmount == 0 || !contract?.depositContractWrite || txStatus.isLoading;
  return (
    <DepositView
      symbol={symbol}
      depositAmount={depositAmount}
      updateDepositAmount={updateDepositAmount}
      shouldButtonDisabled={shouldButtonDisabled}
      contract={contract}
      txStatus={txStatus}
      isEnoughAllowance={isEnoughAllowance}
    />
  );
};

export default DepositLogic;
