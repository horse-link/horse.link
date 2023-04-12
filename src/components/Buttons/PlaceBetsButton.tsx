import React from "react";
import { BaseButton } from "./BaseButton";
import { useBetSlipContext } from "../../providers/BetSlip";

export const PlaceBetsButton: React.FC = () => {
  const { bets, txLoading, placeBetsInBetSlip } = useBetSlipContext();

  return (
    <BaseButton
      loading={txLoading}
      loaderColor="black"
      disabled={!bets || !bets.length || txLoading}
      onClick={placeBetsInBetSlip}
      baseStyleOverride
      className="w-full rounded-lg border-2 border-black py-3 text-center text-lg !font-bold text-black !opacity-100 hover:bg-black hover:text-white disabled:hover:bg-white"
    >
      BET NOW
    </BaseButton>
  );
};
