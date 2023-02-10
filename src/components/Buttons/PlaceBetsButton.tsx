import React from "react";
import { BaseButton } from "./BaseButton";
import { useBetSlipContext } from "../../providers/BetSlip";

export const PlaceBetsButton: React.FC = () => {
  const { bets, txLoading, placeBets } = useBetSlipContext();

  return (
    <BaseButton
      loading={txLoading}
      disabled={!bets || !bets.length || txLoading}
      onClick={placeBets}
      baseStyleOverride
      className="w-full font-bold text-lg border-2 border-black rounded-lg text-black text-center hover:bg-black hover:text-white py-3"
    >
      BET NOW
    </BaseButton>
  );
};
