import React from "react";
import { MeetResults, MeetResult } from "../../types/meets";
import { BaseTable } from "./BaseTable";
import { TableData, TableHeader, TableRow } from "../../types/table";

type Props = {
  results: MeetResults;
};

export const ResultsTable: React.FC<Props> = ({ results }) => {
  const getResultsData = (result: MeetResult): TableData[] => [
    {
      title: result.place,
      classNames: "bg-gray-200"
    },
    {
      title: result.runner
    },
    {
      title: result.number
    },
    {
      title: result.rider
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
      title: "Number"
    },
    {
      title: "Rider"
    }
  ];

  const ROWS: TableRow[] = results.map(result => ({
    data: getResultsData(result)
  }));

  return <BaseTable headers={HEADERS} rows={ROWS} />;
};
