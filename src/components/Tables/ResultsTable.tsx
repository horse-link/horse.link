import React from "react";
import { MeetResults, WinningHorse } from "../../types/meets";
import { BaseTable } from ".";
import { TableData, TableHeader, TableRow } from "../../types/table";
import utils from "../../utils";

type Props = {
  results: MeetResults;
};

export const ResultsTable: React.FC<Props> = ({ results }) => {
  const getWinningHorseData = (horse: WinningHorse): TableData[] => [
    {
      title: utils.formatting.formatOrdinals(horse.place),
      classNames: "bg-gray-200"
    },
    {
      title: horse.runner
    },
    {
      title: horse.number
    },
    {
      title: horse.rider
    }
  ];

  const HEADERS: TableHeader[] = [
    {
      title: "#",
      classNames: "!px-1 !w-10 !bg-gray-200"
    },
    {
      title: "Runner"
    },
    {
      title: "Rider Number"
    },
    {
      title: "Rider"
    }
  ];

  const ROWS: TableRow[] = results.winningHorses.map(horse => ({
    data: getWinningHorseData(horse)
  }));

  return <BaseTable headers={HEADERS} rows={ROWS} />;
};
