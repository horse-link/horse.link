import useSwr from "../useSwr";
import { BetHistoryResponse2 } from "../../types/bets";

export const useBetHistoryData = () => {
  const { data } = useSwr<BetHistoryResponse2[]>(`/bets/history`);

  return data;
};
