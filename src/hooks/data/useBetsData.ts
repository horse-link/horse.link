import useSwr from "../useSwr";
import { BetHistoryResponse2 } from "../../types/bets";
import utils from "../../utils";

export const useBetsData = (marketId?: string) => {
  const { data } = useSwr<{
    bets: Array<BetHistoryResponse2>;
  }>(marketId ? `/bets/history/${marketId}` : `/bets/history`);

  return data?.bets.map(b => ({
    ...b,
    propositionId: utils.formatting.parseBytes16String(b.propositionId)
  }));
};
