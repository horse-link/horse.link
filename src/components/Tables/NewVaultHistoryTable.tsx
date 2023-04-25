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
import { Loader } from "../Loader";

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
          "w-full py-4 text-left text-xs font-semibold text-hl-primary xl:text-base",
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
          const style = "w-full text-left py-4 text-xs xl:text-base";

          const formattedTxType = txTypeMap.get(vault.type);

          const details = utils.config.getVault(vault.vaultAddress, config);

          const amount = utils.formatting.formatToFourDecimals(
            ethers.utils.formatEther(vault.amount)
          );

          const time = dayjs.unix(vault.timestamp).fromNow();

          const data = [
            formattedTxType,
            amount,
            time,
            details?.name || `${vault.vaultAddress.slice(0, 20)}...`
          ];

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
                className={classNames(
                  style,
                  "max-w-[10ch] truncate xl:max-w-[20ch]"
                )}
              >
                {vault.id}
              </a>
            </div>
          ];
        })
      : [];

  const loading = [
    [
      <div key="vaultshistorytable-loading-blank" />,
      <div className="py-4" key="vaultshistorytable-loading-message">
        Loading...
      </div>
    ]
  ];

  return (
    <React.Fragment>
      {/* non-mobile */}
      <div className="hidden lg:block">
        <NewTable
          headers={headers}
          headerStyles="font-basement tracking-wider"
          rows={!history || !config ? loading : rows}
        />
      </div>

      {/* mobile */}
      <div className="block lg:hidden">
        {!history || !config ? (
          <div className="flex w-full justify-center py-10">
            <Loader />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            {history.map(history => {
              return <div>{history.vaultAddress}</div>;
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
