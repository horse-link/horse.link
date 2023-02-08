import React from "react";
import { BaseButton } from "./BaseButton";
import { useBetSlipContext } from "../../providers/BetSlip";

export const SubmitBetsButton: React.FC = () => {
  const { bets, txLoading, placeBets } = useBetSlipContext();

  return (
    <BaseButton
      loading={txLoading}
      disabled={!bets || !bets.length || txLoading}
      onClick={placeBets}
      baseStyleOverride
      className="flex h-full w-full items-center justify-center rounded-lg bg-emerald-500 p-4"
    >
      Submit Bets
    </BaseButton>
  );
};
