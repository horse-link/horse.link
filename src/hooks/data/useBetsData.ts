import useSwr from "../useSwr";
import { BetHistoryResponseNew } from "../../types/bets";

export const useBetsData = () => {
  const { data } = useSwr<BetHistoryResponseNew>(`/bets/history`);

  return data;
};
