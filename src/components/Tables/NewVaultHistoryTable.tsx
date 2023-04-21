import React from "react";
import { FormattedVaultTransaction } from "../../types/subgraph";
import { VaultTransactionType } from "../../types/vaults";
import { useConfig } from "../../providers/Config";
import { useScannerUrl } from "../../hooks/useScannerUrl";
import { NewTable } from "./NewTable";
import classNames from "classnames";
import utils from "../../utils";
import { ethers } from "ethers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const txTypeMap = new Map([
  [VaultTransactionType.WITHDRAW, "Withdrawal"],
  [VaultTransactionType.DEPOSIT, "Deposit"]
]);

type Props = {
  history?: Array<FormattedVaultTransaction>;
};

export const NewVaultHistoryTable: React.FC<Props> = ({ history }) => {
  const config = useConfig();
  const scanner = useScannerUrl();

  const headers = ["Type", "Amount", "Time", "Vault Name", "TxID"].map(
    (text, i) => (
      <div
        key={`vaulthistorytable-${text}-${i}`}
        className={classNames(
          "w-full py-4 text-left font-semibold text-hl-primary",
          {
            "!text-hl-secondary": i === 1
          }
        )}
      >
        {text}
      </div>
    )
  );

  const rows =
    history && config
      ? history.map((vault, i) => {
          const style = "w-full text-left py-4";

          const formattedTxType = txTypeMap.get(vault.type);
          if (!formattedTxType)
            throw new Error(`Cannot get type for vault ${vault.id}`);

          const details = utils.config.getVault(vault.vaultAddress, config);
          if (!details)
            throw new Error(`Cannot get details for vault ${vault.id}`);

          const amount = utils.formatting.formatToFourDecimals(
            ethers.utils.formatEther(vault.amount)
          );

          const time = dayjs.unix(vault.timestamp).fromNow();

          const data = [formattedTxType, amount, time, details.name];

          return [
            ...data.map((text, i) => (
              <div
                key={`vaulthistorytable-rows-${text}-${i}`}
                className={classNames(style, {
                  "!text-hl-secondary": i === 1
                })}
              >
                {text}
              </div>
            )),
            <div
              className="flex h-full w-full items-center truncate"
              key={`vaulthistorytable-${vault.id}-${i}`}
            >
              <a
                href={`${scanner}/tx/${vault.id.toLowerCase()}`}
                target="_blank"
                rel="noreferrer noopener"
                className={classNames(style, "max-w-[20ch] truncate")}
              >
                {vault.id}
              </a>
            </div>
          ];
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
