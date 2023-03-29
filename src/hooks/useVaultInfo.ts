import { BigNumber, ethers, Signer } from "ethers";
import { useApi } from "../providers/Api";
import { VaultInfo } from "../types/config";
import { useVaultContract } from "../hooks/contracts";

export const useVaultInfoList = (
  vaultAddresses?: string[],
  signer?: Signer
) => {
  const api = useApi();
  const { getIndividualAssetTotal, getIndividualShareTotal } =
    useVaultContract();

  const getVaultInfoList = async (): Promise<VaultInfo[]> => {
    const vaultInfoList = await Promise.all(
      (vaultAddresses ?? []).map(vaultAddress =>
        api.getVaultDetail(vaultAddress)
      )
    );
    const basicInfo = vaultInfoList.map(vaultInfo => {
      return {
        ...vaultInfo,
        performance: BigNumber.from(vaultInfo.performance),
        totalAssetsLocked: BigNumber.from(vaultInfo.totalAssetsLocked),
        totalSupply: BigNumber.from(vaultInfo.totalSupply),
        totalAssets: BigNumber.from(vaultInfo.totalAssets)
      };
    });
    // Now add user specific data
    if (signer) {
      return Promise.all(
        basicInfo.map(async vaultInfo => {
          const userAssetTotal = await getIndividualAssetTotal(
            vaultInfo,
            signer
          );
          const userShareTotal = await getIndividualShareTotal(
            vaultInfo,
            signer
          );
          const percentageTotal = ethers.utils.formatUnits(
            userShareTotal?.mul(100).div(vaultInfo.totalSupply.add(1)),
            2
          );

          const userSharePercentage =
            +percentageTotal > 0 && +percentageTotal < 1
              ? `<1`
              : percentageTotal;
          return {
            ...vaultInfo,
            userAssetTotal,
            userShareTotal,
            userSharePercentage
          };
        })
      );
    }

    return basicInfo;
  };

  return { getVaultInfoList };
};
