import React, { useEffect, useState } from "react";
import { BaseTable } from ".";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { Config, VaultInfo } from "../../types/config";
import { VaultModalState, VaultTransactionType } from "../../types/vaults";
import { useAccount, useSigner } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import utils from "../../utils";
import { BigNumber, ethers } from "ethers";
import { VaultActionButton } from "../Buttons";
import Skeleton from "react-loading-skeleton";
import constants from "../../constants";
import { useVaultContract } from "../../hooks/contracts";

type Props = {
  config?: Config;
  setIsModalOpen: (state: VaultModalState) => void;
};

export const VaultListTable: React.FC<Props> = ({ config, setIsModalOpen }) => {
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();
  const { data: signer } = useSigner();
  const [shares, setShares] = useState<Record<`0x${string}`, BigNumber>>();
  const [assets, setAssets] = useState<Record<`0x${string}`, BigNumber>>();
  //const [percentage, setPercentage] = useState<Record<string, BigNumber>>();

  const { getIndividualShareTotal, getIndividualAssetTotal } =
    useVaultContract();

  useEffect(() => {
    if (!isConnected || !config || !signer) return;
    (async () => {
      const shareRecord: Record<`0x${string}`, BigNumber> = {};
      const assetRecord: Record<`0x${string}`, BigNumber> = {};

      await Promise.all(
        config.vaults.map(async (vault: VaultInfo) => {
          const shareTotal = await getIndividualShareTotal(vault, signer);
          const vaultAddress = vault.address;
          const assetTotal = await getIndividualAssetTotal(vault, signer);
          shareRecord[vaultAddress] = shareTotal;
          assetRecord[vaultAddress] = assetTotal;
        })
      );

      setShares(shareRecord);
      setAssets(assetRecord);
    })();
  }, [config, isConnected]);
  const getVaultListData = (vault: VaultInfo): TableData[] => {
    return shares && assets
      ? [
          {
            title: vault.name,
            classNames: "!pl-5 !pr-2 bg-gray-200"
          },
          {
            title: vault.asset.symbol
          },
          {
            title: `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatUnits(vault.totalAssets, vault.asset.decimals)
            )}`
          },
          {
            title: `${utils.formatting.formatToFourDecimals(
              ethers.utils.formatUnits(
                shares[vault.address],
                vault.asset.decimals
              )
            )}`
          },
          {
            title: `${utils.formatting.formatToFourDecimals(
              ethers.utils.formatUnits(
                assets[vault.address],
                vault.asset.decimals
              )
            )}`
          },
          {
            title: (
              <a
                href={`${constants.env.SCANNER_URL}/address/${vault.address}`}
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
        ]
      : [
          {
            title: vault.name,
            classNames: "!pl-5 !pr-2 bg-gray-200"
          },
          {
            title: vault.asset.symbol
          },
          {
            title: `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatUnits(vault.totalAssets, vault.asset.decimals)
            )}`
          },
          {
            title: `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatUnits(vault.totalAssets, vault.asset.decimals)
            )}`
          },
          {
            title: (
              <a
                href={`${constants.env.SCANNER_URL}/address/${vault.address}`}
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
