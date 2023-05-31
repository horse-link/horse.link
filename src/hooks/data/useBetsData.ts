import useSwr from "../useSwr";
import { BetHistoryResponse2 } from "../../types/bets";

export const useBetsData = () => {
  const { data } = useSwr<{
    bets: Array<BetHistoryResponse2>;
  }>(`/bets/history`);

  return data?.bets;
};
