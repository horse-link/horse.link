import { Signer } from "ethers";
import { ERC20__factory } from "../../typechain";

export const useERC20Contract = () => {
  const getBalance = async (tokenAddress: string, signer: Signer) => {
    const userAddress = await signer.getAddress();
    const erc20Contract = ERC20__factory.connect(tokenAddress, signer);
    const balance = await erc20Contract.balanceOf(userAddress);

    return balance;
  };

  const getDecimals = async (tokenAddress: string, signer: Signer) => {
    const erc20Contract = ERC20__factory.connect(tokenAddress, signer);
    const decimals = await erc20Contract.decimals();

    return decimals;
  };

  return {
    getBalance,
    getDecimals
  };
};
