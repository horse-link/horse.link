import React from "react";
import { BaseTable } from ".";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { Config, MarketInfo } from "../../types/config";
import utils from "../../utils";
import Skeleton from "react-loading-skeleton";
import { ethers } from "ethers";

type Props = {
  config?: Config;
};

export const MarketTable: React.FC<Props> = ({ config }) => {
  const getMarketData = (market: MarketInfo): TableData[] => {
    const vault = utils.config.getVault(market.vaultAddress, config);

    return [
      {
        title: vault?.name ?? <Skeleton />,
        classNames: "!pl-5 !pr-2 bg-gray-200"
      },
      {
        title: vault ? (
          `$${utils.formatting.formatToFourDecimals(
            ethers.utils.formatUnits(market.totalInPlay, vault.asset.decimals)
          )} ${vault.asset.symbol}`
        ) : (
          <Skeleton />
        )
      },
      {
        title: market.address
      },
      {
        title: market.vaultAddress
      }
    ];
  };

  const HEADERS: TableHeader[] = [
    {
      title: "Name",
      classNames: "!pl-5 !pr-2 bg-gray-200 !w-[10rem]"
    },
    {
      title: "Total In Play",
      classNames: "!pl-5 !pr-2"
    },
    {
      title: "Market Address"
    },
    {
      title: "Vault Address"
    }
  ];

  const ROWS: TableRow[] = config
    ? config.markets.map(market => ({
        data: getMarketData(market)
      }))
    : utils.tables.getBlankRow(<Skeleton />, HEADERS.length, 0);

  return <BaseTable title="Markets" headers={HEADERS} rows={ROWS} />;
};
