import React from "react";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { BaseTable } from "./BaseTable";
import Skeleton from "react-loading-skeleton";
import { BigNumber, ethers } from "ethers";
import { LeaderboardBalance } from "../../types/leaderboard";
import utils from "../../utils";

type Props = {
  stats?: Array<{
    address: string;
    value: BigNumber;
  }>;
  balances?: Array<LeaderboardBalance>;
};

export const LeaderboardTable: React.FC<Props> = ({ stats, balances }) => {
  const getLeaderboardData = (
    stat: {
      address: string;
      value: BigNumber;
    },
    balance: LeaderboardBalance,
    index: number
  ): TableData[] => [
    {
      title: index + 1
    },
    {
      title: stat.address
    },
    {
      title: `${utils.formatting.formatToFourDecimalsRaw(
        ethers.utils.formatEther(stat.value)
      )} HL`
    },
    {
      title: `${utils.formatting.formatToFourDecimals(balance.formatted)} HL`
    }
  ];

  const HEADERS: TableHeader[] = [
    {
      title: "Rank"
    },
    {
      title: "Address"
    },
    {
      title: "Earnings"
    },
    {
      title: "Balance"
    }
  ];

  const blankRows: TableRow[] = Array.from({ length: 10 }, () => ({
    data: Array.from({ length: HEADERS.length }, () => ({
      title: <Skeleton />
    }))
  }));

  const ROWS: TableRow[] =
    stats && balances
      ? stats.map((stat, i) => {
          const balance = balances.find(
            bal => bal.address.toLowerCase() === stat.address.toLowerCase()
          );
          if (!balance)
            throw new Error(
              `Could not find a balance for address, ${stat.address}`
            );

          return {
            data: getLeaderboardData(stat, balance, i)
          };
        })
      : blankRows;

  return <BaseTable title="Leaderboard" headers={HEADERS} rows={ROWS} />;
};
