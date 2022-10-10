import { ethers } from "ethers";
import { useMemo } from "react";
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
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
    args: [vaultAddress, ethers.constants.MaxUint256],
    enabled: !!tokenAddress && !!vaultAddress
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

const useTokenApproval = (
  tokenAddress: string,
  ownerAddress: string,
  vaultAddress: string,
  tokenDecimal: string
) => {
  const { allowance, refetch: refetchAllowance } = useAllowance({
    address: tokenAddress,
    owner: ownerAddress,
    spender: vaultAddress,
    decimals: tokenDecimal
  });

  const { write, error, isTxLoading } = useApproveContractWrite({
    tokenAddress,
    vaultAddress,
    onTxSuccess: () => refetchAllowance()
  });

  return { allowance, write, error, isTxLoading };
};

export default useTokenApproval;
