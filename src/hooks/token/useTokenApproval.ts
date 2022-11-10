import { ethers } from "ethers";
import { erc20ABI, useContractWrite, useWaitForTransaction } from "wagmi";
import useAllowance from "./useAllowance";

type useApproveContractWriteArgs = {
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
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
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [spenderAddress, ethers.constants.MaxUint256]
  });

  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: onTxSuccess
  });

  return { write, error, isTxLoading };
};

const useTokenApproval = (
  tokenAddress: `0x${string}`,
  ownerAddress: `0x${string}`,
  spenderAddress: `0x${string}`,
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
