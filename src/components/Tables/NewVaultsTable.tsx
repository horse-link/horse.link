import React, { useEffect, useMemo, useState } from "react";
import { NewTable } from "./NewTable";
import { VaultModalState } from "../../types/vaults";
import { useConfig } from "../../providers/Config";
import { useAccount, useSigner } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import { useApi } from "../../providers/Api";
import { useVaultContract } from "../../hooks/contracts";
import { useScannerUrl } from "../../hooks/useScannerUrl";
import { ethers } from "ethers";
import { VaultInfo } from "../../types/config";
import classNames from "classnames";

type Props = {
  setIsModalOpen: (state: VaultModalState) => void;
};

export const NewVaultsTable: React.FC<Props> = ({ setIsModalOpen }) => {
  const config = useConfig();
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const api = useApi();
  const { getIndividualAssetTotal, getIndividualShareTotal } =
    useVaultContract();
  const { data: signer } = useSigner();
  const scanner = useScannerUrl();

  const vaultAddresses = useMemo(() => {
    if (!config) return;

    return config.vaults.map(v => v.address);
  }, [config]);

  const [vaultInfoList, setVaultInfoList] = useState<Array<VaultInfo>>();

  useEffect(() => {
    if (!isConnected || !config || !vaultAddresses) return;

    setVaultInfoList(undefined);
    Promise.all(vaultAddresses.map(api.getVaultDetail)).then(infoList => {
      const formatted = infoList.map(i => ({
        ...i,
        totalSupply: ethers.BigNumber.from(i.totalSupply),
        totalAssets: ethers.BigNumber.from(i.totalAssets),
        performance: ethers.BigNumber.from(i.performance)
      }));

      if (!signer) return setVaultInfoList(formatted);

      // add user data
      Promise.all(
        formatted.map(async info => {
          const [userAssetTotal, userShareTotal] = await Promise.all([
            getIndividualAssetTotal(info, signer),
            getIndividualShareTotal(info, signer)
          ]);

          const percentageTotal = ethers.utils.formatUnits(
            userShareTotal.mul("100").div(info.totalSupply.add("1")),
            2
          );

          const userSharePercentage =
            +percentageTotal > 0 && +percentageTotal < 1
              ? `<1`
              : percentageTotal;

          return {
            ...info,
            userAssetTotal,
            userShareTotal,
            userSharePercentage
          };
        })
      ).then(setVaultInfoList);
    });
  }, [config, isConnected, signer, vaultAddresses]);

  const headers = [
    "Name",
    "Token",
    "TVL",
    "My Shares",
    "My Value",
    "My Percentage",
    "Vault Address",
    "Deposit",
    "Withdraw"
  ].map((text, i) => (
    <div
      key={`vaultstable-${text}-${i}`}
      className={classNames(
        "w-full py-4 text-left font-semibold text-hl-primary",
        {
          "!text-hl-secondary": [1, 5].includes(i)
        }
      )}
    >
      {text}
    </div>
  ));

  const rows = vaultInfoList?.length
    ? vaultInfoList.map((vault, i) => {
        const style = "w-full text-left py-4";

        return [];
      })
    : [];

  return (
    <NewTable
      headers={headers}
      headerStyles="font-basement tracking-wider"
      rows={rows}
    />
  );
};
