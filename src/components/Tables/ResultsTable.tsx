import React from "react";
import { MeetResults, MeetResult } from "../../types/meets";
import { BaseTable } from "./BaseTable";
import { DataProps, HeaderProps, RowProps } from "../../types/table";

type Props = {
  results: MeetResults;
};

export const ResultsTable: React.FC<Props> = ({ results }) => {
  const getResultsData = (result: MeetResult): DataProps[] => [
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

  const HEADERS: HeaderProps[] = [
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

  const ROWS: RowProps[] = results.map(result => ({
    data: getResultsData(result)
  }));

  return <BaseTable headers={HEADERS} rows={ROWS} />;
};
