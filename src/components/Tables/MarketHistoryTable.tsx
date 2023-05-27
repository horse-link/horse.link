import React from "react";
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
import { BetHistory } from "../../hooks/subgraph";

dayjs.extend(relativeTime);

const txTypeMap = new Map([
  [VaultTransactionType.WITHDRAW, "Placed"],
  [VaultTransactionType.DEPOSIT, "Repaid"],
  [VaultTransactionType.BORROW, "Settled"],
  [VaultTransactionType.REPAY, "Refunded"]
]);

type Props = {
  betHistory?: BetHistory;
};

export const MarkettHistoryTable: React.FC<Props> = ({ betHistory }) => {
  const config = useConfig();
  const scanner = useScannerUrl();

  const headers = ["Type", "Amount", "Time", "Address", "TxID"].map(
    (text, i) => (
      <div
        key={`bethistorytable-${text}-${i}`}
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
    betHistory && config
      ? betHistory.map((history, i) => {
          const style = "w-full text-left py-4 text-xs xl:text-base";

          const formattedTxType = txTypeMap.get(history.type);

          const details = utils.config.getVault(history.vaultAddress, config);

          const amount = utils.formatting.formatToFourDecimals(
            ethers.utils.formatEther(history.amount)
          );

          const time = dayjs.unix(history.createdAt).fromNow();

          const data = [
            formattedTxType,
            amount,
            time,
            details?.name || `${history.vaultAddress?.slice(0, 20)}...`
          ];

          return [
            ...data.map((text, i) => (
              <div
                key={`bethistorytable-rows-${text}-${i}`}
                className={classNames(style, {
                  "!text-hl-secondary": i === 1
                })}
              >
                {text}
              </div>
            )),
            <div
              className="flex h-full w-full items-center truncate"
              key={`bethistorytable-${history.tx}-${i}`}
            >
              <a
                href={`${scanner}/tx/${history.tx?.toLowerCase()}`}
                target="_blank"
                rel="noreferrer noopener"
                className={classNames(
                  style,
                  "max-w-[10ch] truncate xl:max-w-[20ch]"
                )}
              >
                {history.tx}
              </a>
            </div>
          ];
        })
      : [];

  const loading = [
    [
      <div key="bethistorytable-loading-blank" />,
      <div className="py-4" key="bethistorytable-loading-message">
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
        {!betHistory || !config ? (
          <div className="flex w-full justify-center py-10">
            <Loader />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            {betHistory.map(history => {
              const formattedTxType = txTypeMap.get(history.type);

              const details = utils.config.getVault(
                history.vaultAddress,
                config
              );

              const amount = utils.formatting.formatToFourDecimals(
                ethers.utils.formatUnits(
                  history.amount,
                  details?.asset.decimals
                )
              );

              return (
                <div
                  key={history.tx}
                  className="flex w-full flex-col items-center gap-y-2 border-t border-hl-border py-2 text-center"
                >
                  <h2 className="font-basement tracking-wider text-hl-secondary">
                    {formattedTxType}
                  </h2>
                  <p>
                    {amount} {details?.asset.symbol}
                  </p>
                  <a
                    href={`${scanner}/address/${history.vaultAddress}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full max-w-full truncate"
                  >
                    Vault: {history.vaultAddress}
                  </a>
                  <a
                    href={`${scanner}/tx/${history.tx}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full max-w-full truncate"
                  >
                    TxID: {history.tx}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
