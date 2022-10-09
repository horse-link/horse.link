import { useEffect, useState } from "react";
import TokensView from "./Tokens_View";
import { useParams } from "react-router-dom";

const Tokens: React.FC = () => {
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

  return <TokensView></TokensView>;
};

export default Tokens;
