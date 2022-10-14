import { ethers } from "ethers";
import { useMemo } from "react";
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  useWaitForTransaction
} from "wagmi";

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

type useApproveContractWriteArgs = {
  tokenAddress: string;
  spenderAddress: string;
  onTxSuccess: () => void;
};

const useApproveContractWrite = ({
  tokenAddress,
  spenderAddress,
  onTxSuccess
}: useApproveContractWriteArgs) => {
  const {
    data: approveData,
    write,
    error
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [spenderAddress, ethers.constants.MaxUint256],
    enabled: !!tokenAddress && !!spenderAddress
  });

  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: onTxSuccess
  });

  return { write, error, isTxLoading };
};

const useTokenApproval = (
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  tokenDecimal: string
) => {
  const { allowance, refetch: refetchAllowance } = useAllowance({
    address: tokenAddress,
    owner: ownerAddress,
    spender: spenderAddress,
    decimals: tokenDecimal
  });

  const { write, error, isTxLoading } = useApproveContractWrite({
    tokenAddress,
    spenderAddress,
    onTxSuccess: () => refetchAllowance()
  });

  return { allowance, write, error, isTxLoading };
};

export default useTokenApproval;
