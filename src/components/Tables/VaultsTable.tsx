import React, { useEffect, useMemo, useState } from "react";
import { BaseTable } from ".";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { Config, VaultInfo } from "../../types/config";
import { VaultModalState, VaultTransactionType } from "../../types/vaults";
import { useAccount, useSigner } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import utils from "../../utils";
import { ethers } from "ethers";
import { VaultActionButton } from "../Buttons";
import Skeleton from "react-loading-skeleton";
import { useScannerUrl } from "../../hooks/useScannerUrl";
import { useApi } from "../../providers/Api";
import { useVaultContract } from "../../hooks/contracts";

type Props = {
  config?: Config;
  setIsModalOpen: (state: VaultModalState) => void;
};

export const VaultsTable: React.FC<Props> = ({ config, setIsModalOpen }) => {
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

  const [vaultInfoList, setVaultInfoList] = useState<VaultInfo[]>();

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

  const getVaultListData = (vault: VaultInfo): TableData[] => {
    if (!vaultInfoList?.length) {
      return [];
    }

    return [
      {
        title: vault.name,
        classNames: "!pl-5 !pr-2 bg-gray-200"
      },
      {
        title: vault.asset.symbol
      },
      {
        title: vault ? (
          `$${utils.formatting.formatToFourDecimals(
            ethers.utils.formatUnits(
              vault.totalAssets.add(vault.totalAssetsLocked),
              vault.asset.decimals
            )
          )}`
        ) : (
          <Skeleton />
        )
      },
      {
        title: vault?.userShareTotal ? (
          `${utils.formatting.formatToFourDecimals(
            ethers.utils.formatUnits(vault.userShareTotal, vault.asset.decimals)
          )}`
        ) : (
          <Skeleton />
        )
      },
      {
        title: vault?.userAssetTotal ? (
          `$${utils.formatting.formatToFourDecimals(
            ethers.utils.formatUnits(vault.userAssetTotal, vault.asset.decimals)
          )}`
        ) : (
          <Skeleton />
        )
      },
      {
        title: vault ? `${vault.userSharePercentage}%` : <Skeleton />
      },
      {
        title: (
          <a
            href={`${scanner}/address/${vault.address}`}
            target="_blank"
            rel="noreferrer noopener"
            className="hyperlink"
          >
            {vault.address}
          </a>
        )
      },
      {
        title: (
          <React.Fragment>
            <VaultActionButton
              title="DEPOSIT"
              vault={vault}
              isConnected={isConnected}
              openWalletModal={openWalletModal}
              setIsModalOpen={setIsModalOpen}
              type={VaultTransactionType.DEPOSIT}
            />
            <VaultActionButton
              title="WITHDRAW"
              vault={vault}
              isConnected={isConnected}
              openWalletModal={openWalletModal}
              setIsModalOpen={setIsModalOpen}
              type={VaultTransactionType.WITHDRAW}
            />
          </React.Fragment>
        ),
        classNames: "text-right"
      }
    ];
  };

  const HEADERS: TableHeader[] = [
    {
      title: "Name",
      classNames: "!pl-5 !pr-2 bg-gray-200 !w-[10rem]"
    },
    {
      title: "Token"
    },
    {
      title: "TVL"
    },
    {
      title: "My Shares"
    },
    {
      title: "My Value"
    },
    {
      title: "My Percentage"
    },
    {
      title: "Vault Address"
    },
    {
      title: "Deposit / Withdraw",
      classNames: "text-right !pr-6"
    }
  ];

  const ROWS: TableRow[] =
    vaultInfoList?.map(vaultInfo => ({
      data: getVaultListData(vaultInfo)
    })) || utils.tables.getBlankRow(<Skeleton />, HEADERS.length, 0);

  return (
    <BaseTable title="Vaults / Liquidity Pools" headers={HEADERS} rows={ROWS} />
  );
};
