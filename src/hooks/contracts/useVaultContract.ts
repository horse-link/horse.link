import { BigNumber, ethers, Signer } from "ethers";
import { ERC20__factory, Vault__factory } from "../../typechain";
import { VaultInfo } from "horselink-sdk";

export const useVaultContract = () => {
  const deposit = async (
    vault: VaultInfo,
    amount: BigNumber,
    signer: Signer
  ) => {
    const vaultContract = Vault__factory.connect(vault.address, signer);
    const erc20Contract = ERC20__factory.connect(vault.asset.address, signer);

    const userAddress = await signer.getAddress();

    const userAllowance = await erc20Contract.allowance(
      userAddress,
      vault.address
    );
    if (userAllowance.lt(amount)) {
      const [gasLimit, gasPrice] = await Promise.all([
        erc20Contract.estimateGas.approve(
          vault.address,
          ethers.constants.MaxUint256
        ),
        signer.getGasPrice()
      ]);

      await (
        await erc20Contract.approve(
          vault.address,
          ethers.constants.MaxUint256,
          {
            gasLimit,
            gasPrice
          }
        )
      ).wait();
    }

    const [gasLimit, gasPrice] = await Promise.all([
      vaultContract.estimateGas.deposit(amount, userAddress),
      signer.getGasPrice()
    ]);

    const receipt = await (
      await vaultContract.deposit(amount, userAddress, {
        gasLimit,
        gasPrice
      })
    ).wait();

    return receipt.transactionHash;
  };

  const totalAssetsLocked = async (
    vault: VaultInfo,
    provider: ethers.providers.Provider
  ): Promise<BigNumber> => {
    const vaultContract = Vault__factory.connect(vault.address, provider);
    return vaultContract.totalAssetsLocked();
  };

  const withdraw = async (
    vault: VaultInfo,
    amount: BigNumber,
    signer: Signer
  ): Promise<string> => {
    const userAddress = await signer.getAddress();

    const vaultContract = Vault__factory.connect(vault.address, signer);

    const [gasLimit, gasPrice] = await Promise.all([
      vaultContract.estimateGas.withdraw(amount, userAddress, userAddress),
      signer.getGasPrice()
    ]);

    const receipt = await (
      await vaultContract.withdraw(amount, userAddress, userAddress, {
        gasLimit,
        gasPrice
      })
    ).wait();

    return receipt.transactionHash;
  };

  const getIndividualShareTotal = async (
    vault: VaultInfo,
    signer: Signer
  ): Promise<BigNumber> => {
    const userAddress = await signer.getAddress();
    const vaultContract = Vault__factory.connect(vault.address, signer);
    const shares = await vaultContract.balanceOf(userAddress);
    return shares.mul(100);
  };

  const getIndividualAssetTotal = async (
    vault: VaultInfo,
    signer: Signer
  ): Promise<BigNumber> => {
    const userAddress = await signer.getAddress();
    const vaultContract = Vault__factory.connect(vault.address, signer);
    const shares = await vaultContract.balanceOf(userAddress);
    const assets = await vaultContract.convertToAssets(shares);

    return assets;
  };

  const getSupplyTotal = async (
    vault: VaultInfo,
    signer: Signer
  ): Promise<BigNumber> => {
    const vaultContract = Vault__factory.connect(vault.address, signer);
    const supply = await vaultContract.totalSupply();
    return supply;
  };

  return {
    deposit,
    totalAssetsLocked,
    withdraw,
    getIndividualShareTotal,
    getIndividualAssetTotal,
    getSupplyTotal
  };
};
