import React from "react";
import { BaseButton } from "./BaseButton";
import { useBetSlipContext } from "../../context/BetSlipContext";

export const PlaceBetsButton: React.FC = () => {
  const { bets, txLoading, openModal } = useBetSlipContext();

  return (
    <BaseButton
      loading={txLoading}
      disabled={!bets || !bets.length || txLoading}
      onClick={openModal}
      baseStyleOverride
      className="flex h-full w-full items-center justify-center rounded-lg bg-emerald-500 p-4"
    >
      Place Bets
    </BaseButton>
  );
};
