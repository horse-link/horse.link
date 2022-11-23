import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { Address, erc20ABI, useContractRead } from "wagmi";
import api from "../../apis/Api";

type useAllowanceArgs = {
  address: string;
  owner: Address;
  spender: Address;
  decimals: string;
};
const useAllowanceFromContract = ({
  address,
  owner,
  spender,
  decimals
}: useAllowanceArgs) => {
  const { data: bnAllowance, refetch } = useContractRead({
    address: address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [owner, spender]
  });
  const allowance = useMemo(() => {
    if (!bnAllowance) return "0";
    return Number(ethers.utils.formatUnits(bnAllowance, decimals));
  }, [bnAllowance]);
  return { allowance, refetch };
};

const useAllowanceFromAPI = ({
  address,
  owner,
  spender,
  decimals
}: useAllowanceArgs) => {
  const [allowance, setAllowance] = useState("0");
  const [fetchIndex, setFetchIndex] = useState(0);
  useEffect(() => {
    if (!address || !owner || !spender || !decimals) return;
    const load = async () => {
      const { allowance } = await api.getAllowance(
        address,
        owner,
        spender,
        decimals
      );
      setAllowance(allowance);
    };
    load();
  }, [address, owner, spender, fetchIndex]);
  const refetch = () => setFetchIndex(i => i + 1);
  return { allowance, refetch };
};

const shouldUseAPI = process.env.VITE_REST_FOR_TOKEN;

const useAllowance = (args: useAllowanceArgs) => {
  if (shouldUseAPI) {
    const { allowance, refetch } = useAllowanceFromAPI(args);
    return { allowance, refetch };
  }
  const { allowance, refetch } = useAllowanceFromContract(args);
  return { allowance, refetch };
};

export default useAllowance;
