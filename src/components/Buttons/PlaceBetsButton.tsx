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
      className="flex h-full w-full justify-center font-bold text-2xl border-2 border-black rounded-lg text-black p-4 hover:bg-black hover:text-white"
    >
      BET NOW
    </BaseButton>
  );
};
