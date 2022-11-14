import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import api from "../../apis/Api";
import { BetHistory } from "../../types";

const useBets = () => {
  const { address } = useAccount();

  const [bets, setBets] = useState<BetHistory[]>();
  const [myBets, setMyBets] = useState<BetHistory[]>();

  useEffect(() => {
    const load = async () => {
      const { results } = await api.getBetHistory();
      setBets(results);
    };
    load();
  }, []);

  useEffect(() => {
    if (!address) return;
    const load = async () => {
      const { results } = await api.getUserBetHistory(address);
      setMyBets(results);
    };
    load();
  }, [address]);

  return { bets, myBets };
};

export default useBets;
