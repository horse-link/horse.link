import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useApi from "../../hooks/useApi";
import { BetHistory } from "../../types";
import BetsView from "./Bets_View";

const useBets = () => {
  const api = useApi();
  const { address } = useAccount();

  const [bets, setBets] = useState<BetHistory[]>([]);
  const [myBets, setMyBets] = useState<BetHistory[]>([]);

  useEffect(() => {
    const load = async () => {
      const { results } = await api.getBetHistory();
      setBets(results);
    };
    load();
  }, [api]);

  useEffect(() => {
    if (!address) return;
    const load = async () => {
      const { results } = await api.getUserBetHistory(address);
      setMyBets(results);
    };
    load();
  }, [api, address]);

  return { bets, myBets };
};

const BetsLogics = () => {
  const { bets, myBets } = useBets();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [myBetsEnabled, setMyBetsEnabled] = useState(false);

  const onClickBet = (betData: any) => {
    setIsModalOpen(true);
  };

  const onMyBetToggle = (isEnable: boolean) => {
    setMyBetsEnabled(isEnable);
  };

  return (
    <BetsView
      betsData={myBetsEnabled ? myBets : bets}
      onClickBet={onClickBet}
      isModalOpen={isModalOpen}
      onCloseModal={() => setIsModalOpen(false)}
      myBetsEnabled={myBetsEnabled}
      onMyBetToggle={onMyBetToggle}
    />
  );
};

export default BetsLogics;
