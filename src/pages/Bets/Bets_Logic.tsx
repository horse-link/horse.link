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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickBet = (betData: any) => {
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <BetsView
      betsData={betsData}
      onClickBet={onClickBet}
      isModalOpen={isModalOpen}
      onCloseModal={onCloseModal}
    />
  );
};

export default BetsLogics;
