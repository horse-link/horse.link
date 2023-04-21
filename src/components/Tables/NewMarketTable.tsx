import React from "react";
import { NewTable } from "./NewTable";
import { useConfig } from "../../providers/Config";
import classNames from "classnames";
import utils from "../../utils";
import { ethers } from "ethers";
import { useScannerUrl } from "../../hooks/useScannerUrl";

export const NewMarketTable: React.FC = () => {
  const config = useConfig();
  const scanner = useScannerUrl();

  const headers = [
    "Name",
    "Total In Play",
    "Market Address",
    "Vault Address"
  ].map((text, i) => (
    <div
      key={`markettable-${text}-${i}`}
      className={classNames(
        "w-full py-4 text-left font-semibold text-hl-primary",
        {
          "!text-hl-secondary": i === 1
        }
      )}
    >
      {text}
    </div>
  ));

  const rows = config
    ? config.markets.map((market, i) => {
        const vault = utils.config.getVault(market.vaultAddress, config);
        if (!vault)
          throw new Error(`Could not find vault for market ${market.address}`);

        const style = "w-full text-left py-4";

        const totalInPlay = `${utils.formatting.formatToFourDecimals(
          ethers.utils.formatUnits(market.totalInPlay, vault.asset.decimals)
        )} ${vault.asset.symbol}`;

        const data = [vault.name, totalInPlay];

        return [
          ...data.map((text, i) => (
            <div
              key={`markettable-rows-${text}-${i}`}
              className={classNames(style, {
                "!text-hl-secondary": i === 1
              })}
            >
              {text}
            </div>
          )),
          <div
            className="flex h-full w-full items-center truncate"
            key={`markettable-${market.address}-${i}`}
          >
            <a
              href={`${scanner}/address/${market.address}`}
              target="_blank"
              rel="noreferrer noopener"
              className={classNames(style, "max-w-[20ch] truncate")}
            >
              {market.address}
            </a>
          </div>,
          <div
            className="flex h-full w-full items-center truncate"
            key={`markettable-${market.vaultAddress}-${i}`}
          >
            <a
              href={`${scanner}/address/${market.vaultAddress}`}
              target="_blank"
              rel="noreferrer noopener"
              className={classNames(style, "max-w-[20ch] truncate")}
            >
              {market.vaultAddress}
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
