import { useEffect, useState } from "react";
import HistoryView from "./History_View";
import { useParams } from "react-router-dom";

const History: React.FC = () => {
  // const _runners: Runner[] = [];
  // const { track, number } = useParams();

  // const load = async () => {
  //   const runners: SignedRunnersResponse = await api.getRunners(
  //     track || "",
  //     Number(number) || 0
  //   );
  //   setResponse(runners);
  // };

  // useEffect(() => {
  //   load();
  // });

  const _results: string[] = [];

  return <HistoryView results={_results}></HistoryView>;
};

export default History;
