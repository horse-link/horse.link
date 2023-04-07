import React from "react";
import { BaseTable } from ".";
import { FormattedVaultTransaction } from "../../types/subgraph";
import { TableData, TableHeader, TableRow } from "../../types/table";
import utils from "../../utils";
import { VaultTransactionType } from "../../types/vaults";
import { ethers } from "ethers";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useScannerUrl } from "../../hooks/useScannerUrl";
import { useConfig } from "../../providers/Config";

dayjs.extend(relativeTime);

const txTypeMap = new Map([
  [VaultTransactionType.WITHDRAW, "Withdrawal"],
  [VaultTransactionType.DEPOSIT, "Deposit"]
]);

type Props = {
  history?: FormattedVaultTransaction[];
};

export const VaultHistoryTable: React.FC<Props> = ({ history }) => {
  const config = useConfig();
  const scanner = useScannerUrl();

  const getHistoryData = (vault?: FormattedVaultTransaction): TableData[] => {
    const formattedTxType = vault && txTypeMap.get(vault.type);
    const details = vault && utils.config.getVault(vault.vaultAddress, config);

    return [
      {
        title: formattedTxType,
        classNames: "!pl-5 !pr-2 bg-gray-200"
      },
      {
        title: vault ? (
          utils.formatting.formatToFourDecimals(
            ethers.utils.formatEther(vault.amount)
          )
        ) : (
          <Skeleton width="2em" />
        )
      },
      {
        title: vault ? (
          dayjs.unix(vault.timestamp).fromNow()
        ) : (
          <Skeleton width="2em" />
        )
      },
      {
        title: details?.name || <Skeleton />
      },
      {
        title: vault ? (
          <a
            href={`${scanner}/tx/${vault.id.toLowerCase()}`}
            target="_blank"
            rel="noreferrer noopener"
            className="hyperlink truncate"
          >
            {vault.id}
          </a>
        ) : (
          <Skeleton width="2em" />
        )
      }
    ];
  };

  const HEADERS: TableHeader[] = [
    {
      title: "Type",
      classNames: "!pl-5 !pr-2 bg-gray-200 !w-[10rem]"
    },
    {
      title: "Amount"
    },
    {
      title: "Time"
    },
    {
      title: "Vault Name"
    },
    {
      title: "TxID"
    }
  ];

  const ROWS: TableRow[] = (history || utils.mocks.getMockVaultTableRows()).map(
    vault => ({
      data: getHistoryData(vault)
    })
  );

  return (
    <BaseTable
      title="History"
      tableStyles="w-full mt-8"
      headers={HEADERS}
      rows={ROWS}
    />
  );
};
