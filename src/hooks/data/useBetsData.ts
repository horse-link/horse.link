import useSwr from "../useSwr";
import { BetFilterOptions, BetHistoryResponse2 } from "../../types/bets";
import utils from "../../utils";

export const useBetsData = (filters?: {
  marketId?: string;
  betFilterOption?: BetFilterOptions;
}) => {
  const { data } = useSwr<{
    bets: Array<BetHistoryResponse2>;
  }>(
    filters?.marketId
      ? `/bets/history/${filters.marketId}`
      : `/bets/history?filter=${filters?.betFilterOption || "ALL_BETS"}`
  );

  return data?.bets.map(b => ({
    ...b,
    propositionId: utils.formatting.parseBytes16String(b.propositionId)
  }));
};
