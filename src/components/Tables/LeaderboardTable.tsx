import React from "react";
import { LeaderboardStat } from "../../types/leaderboard";
import { BaseTable } from "./BaseTable";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { ethers } from "ethers";
import utils from "../../utils";
import Skeleton from "react-loading-skeleton";
import { AddressLink } from "../AddressLink";
import { Address } from "wagmi";

type Props = {
  stats?: Array<LeaderboardStat>;
};

export const LeaderboardTable: React.FC<Props> = ({ stats }) => {
  const getValues = (stat: LeaderboardStat, index: number): TableData[] => [
    {
      title: index + 1
    },
    {
      title: <AddressLink address={stat.address as Address} />
    },
    {
      title: `${utils.formatting.formatToFourDecimals(
        ethers.utils.formatEther(stat.value)
      )} HL`
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
    }
  ];

  const blankRows: TableRow[] = utils.mocks
    .getMockLeaderboardStats()
    .map(() => ({
      data: Array.from({ length: HEADERS.length }, () => ({
        title: <Skeleton />
      }))
    }));

  const ROWS: TableRow[] = stats
    ? stats.map((stat, i) => ({
        data: getValues(stat, i)
      }))
    : blankRows;

  return <BaseTable headers={HEADERS} rows={ROWS} />;
};
