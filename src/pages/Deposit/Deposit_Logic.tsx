import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DepositView from "./Deposit_View";
import vaultContractJson from "../../abi/Vault.json";
import mockTokenContractJson from "../../abi/MockToken.json";
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
  const { data: bnAllowance } = useContractRead({
    addressOrName: address,
    contractInterface: erc20ABI,
    functionName: "allowance",
    args: [owner, spender]
  });
  const allowance = useMemo(() => {
    if (!bnAllowance) return "0";
    return ethers.utils.formatUnits(bnAllowance, decimals);
  }, [bnAllowance]);
  return { allowance };
};

const DepositLogic = () => {
  const { vaultAddress: vaultAddressParam } = useParams();
  const { address } = useAccount();
  const vaultAddress = vaultAddressParam || "";
  const ownerAddress = address || "";

  const {
    symbol,
    address: tokenAddress,
    decimals: tokenDecimal //16
  } = useTokenData(vaultAddress);
  const [depositAmount, setDepositAmount] = useState(0);

  const { allowance } = useAllowance({
    address: tokenAddress,
    owner: ownerAddress,
    spender: vaultAddress,
    decimals: tokenDecimal
  });

  const isEnoughAllowance = Number(allowance) >= depositAmount;

  const assets = ethers.utils.parseUnits(
    depositAmount.toString(),
    tokenDecimal
  );
  const receiver = ownerAddress;
  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi,
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
      isEnoughAllowance={isEnoughAllowance}
    />
  );
};

export default DepositLogic;
