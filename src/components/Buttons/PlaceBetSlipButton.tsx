import React from "react";
import { BaseButton } from "./BaseButton";
import { useBetSlipContext } from "../../context/BetSlipContext";

export const PlaceBetSlipButton: React.FC = () => {
  const { bets, openModal } = useBetSlipContext();

  return (
    <BaseButton
      disabled={!bets || !bets.length}
      onClick={openModal}
      baseStyleOverride
      className="w-full bg-emerald-500 rounded-lg p-4 flex items-center justify-center h-full"
    >
      Place Bets
    </BaseButton>
  );
};
