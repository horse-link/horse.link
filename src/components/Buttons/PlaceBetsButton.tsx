import React from "react";
import { BaseButton } from "./BaseButton";
import { useBetSlipContext } from "../../context/BetSlipContext";

export const PlaceBetsButton: React.FC = () => {
  const { bets, txLoading, placeBets } = useBetSlipContext();

  return (
    <BaseButton
      loading={txLoading}
      disabled={!bets || !bets.length || txLoading}
      onClick={placeBets}
      baseStyleOverride
      className="w-full bg-emerald-500 rounded-lg p-4 flex items-center justify-center h-full"
    >
      Place Bets
    </BaseButton>
  );
};
