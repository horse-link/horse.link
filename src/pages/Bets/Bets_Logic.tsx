import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { BetHistory } from "../../types";
import BetsView from "./Bets_View";

const useBets = () => {
  const api = useApi();

  const [bets, setBets] = useState<BetHistory[]>([]);

  useEffect(() => {
    const load = async () => {
      const { results } = await api.getBetHistory();
      setBets(results);
    };
    load();
  }, [api]);

  return bets;
};

const BetsLogics = () => {
  const betsData = useBets();
  const onClickBet = (betData: any) => {
    console.log("Clicked bet", betData);
  };
  return <BetsView betsData={betsData} onClickBet={onClickBet} />;
};

export default BetsLogics;
