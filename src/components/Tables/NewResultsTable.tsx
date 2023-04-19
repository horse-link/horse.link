import React from "react";
import { MeetResults } from "../../types/meets";
import { NewTable } from "./NewTable";

type Props = {
  results?: MeetResults;
};

export const NewResultsTable: React.FC<Props> = ({ results }) => {
  console.log(results);
  return <NewTable headers={[]} rows={[]} />;
};
