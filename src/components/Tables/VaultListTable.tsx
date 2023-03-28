import React, { useEffect, useState } from "react";
import { BaseTable } from ".";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { Config, VaultInfo } from "../../types/config";
import {
  VaultModalState,
  VaultTransactionType,
  VaultUserData
} from "../../types/vaults";
import { Address, useAccount, useSigner } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import utils from "../../utils";
import { BigNumber, ethers } from "ethers";
import { VaultActionButton } from "../Buttons";
import Skeleton from "react-loading-skeleton";
import { useVaultContract } from "../../hooks/contracts";
import { useScannerUrl } from "../../hooks/useScannerUrl";
import { useApi } from "../../providers/Api";

type Props = {
  config?: Config;
  setIsModalOpen: (state: VaultModalState) => void;
};

export const VaultListTable: React.FC<Props> = ({ config, setIsModalOpen }) => {
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();
  const { data: signer } = useSigner();
  const [userData, setUserData] = useState<Record<Address, VaultUserData>>();
  const scanner = useScannerUrl();

  const { getIndividualShareTotal, getIndividualAssetTotal, getSupplyTotal } =
    useVaultContract();

  // Use API
  const api = useApi();

  useEffect(() => {
    if (!isConnected || !config || !signer) {
      //If a user is disconnected we show the skeleton
      setUserData(undefined);
      return;
    }
    (async () => {
      const individualRecords: Record<Address, VaultUserData> = {};

      config.vaults = await Promise.all(
        config.vaults.map(async (vault: VaultInfo) => {
          const [shareTotal, assetTotal, totalSupply, vaultDetail] =
            await Promise.all([
              getIndividualShareTotal(vault, signer),
              getIndividualAssetTotal(vault, signer),
              getSupplyTotal(vault, signer),
              api.getVaultDetail(vault.address)
            ]);

          const percentageTotal = ethers.utils.formatUnits(
            shareTotal.mul(100).div(totalSupply.add(1)),
            2
          );

          individualRecords[vault.address] = {
            percentage:
              +percentageTotal > 0 && +percentageTotal < 1
                ? `<1`
                : percentageTotal,
            userShareBalance: shareTotal,
            userAssetBalance: assetTotal
          };
          const result: VaultInfo = {
            ...vault,
            totalAssets: BigNumber.from(vaultDetail.totalAssets),
            totalSupply: BigNumber.from(vaultDetail.totalSupply),
            totalAssetsLocked: BigNumber.from(vaultDetail.totalAssetsLocked)
          };
          return result;
        })
      );
      setUserData(individualRecords);
    })();
  }, [config, isConnected, signer]);

  const getVaultListData = (vault: VaultInfo): TableData[] => [
    {
      title: vault.name,
      classNames: "!pl-5 !pr-2 bg-gray-200"
    },
    {
      title: vault.asset.symbol
    },
    {
      title: `$${utils.formatting.formatToFourDecimals(
        ethers.utils.formatUnits(
          BigNumber.from(vault.totalAssets).add(
            BigNumber.from(vault.totalAssetsLocked)
          ),
          vault.asset.decimals
        )
      )}`
    },
    {
      title: userData ? (
        `${utils.formatting.formatToFourDecimals(
          ethers.utils.formatUnits(
            userData[vault.address].userShareBalance,
            vault.asset.decimals
          )
        )}`
      ) : (
        <Skeleton />
      )
    },
    {
      title: userData ? (
        `$${utils.formatting.formatToFourDecimals(
          ethers.utils.formatUnits(
            userData[vault.address].userAssetBalance,
            vault.asset.decimals
          )
        )}`
      ) : (
        <Skeleton />
      )
    },
    {
      title: userData ? `${userData[vault.address].percentage}%` : <Skeleton />
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

  const ROWS: TableRow[] = config
    ? config.vaults.map(vault => ({
        data: getVaultListData(vault)
      }))
    : utils.tables.getBlankRow(<Skeleton />, HEADERS.length, 0);

  return (
    <BaseTable title="Vaults / Liquidity Pools" headers={HEADERS} rows={ROWS} />
  );
};
