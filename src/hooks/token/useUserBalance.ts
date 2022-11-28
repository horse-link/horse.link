import { ethers, Signer } from "ethers";
import { useEffect, useState } from "react";
import { ERC20__factory } from "../../typechain";
import { formatToFourDecimals } from "../../utils/formatting";
import { UserBalance } from "../../types";
import useRefetch from "../useRefetch";

const useUserBalance = (
  tokenAddress?: string,
  signer?: Signer | null
) => {
  const [balance, setBalance] = useState<UserBalance>();
  const { shouldRefetch, refetch } = useRefetch();

  useEffect(() => {
    if (!tokenAddress || !signer) return;

    const contract = ERC20__factory.connect(tokenAddress, signer);
    setBalance(undefined);
    (async () => {
      const userAddress = await signer.getAddress();
      const [decimals, amount] = await Promise.all([
        contract.decimals(),
        contract.balanceOf(userAddress)
      ]);

      setBalance({
        value: amount,
        decimals,
        formatted: formatToFourDecimals(
          ethers.utils.formatUnits(amount, decimals)
        )
      });
    })();
  }, [tokenAddress, signer, shouldRefetch]);

  return {
    balance,
    refetch
  };
};

export default useUserBalance;
