import React, { useCallback } from "react";
import { BaseButton } from "./BaseButton";
import { useBetSlipContext } from "../../context/BetSlipContext";

export const ClearBetSlipButton: React.FC = () => {
  const { txLoading, clearBets } = useBetSlipContext();

  const clear = useCallback(() => {
    const confirmation = confirm(
      "Are you sure you want to clear your bet slip?"
    );
    if (!confirmation) return;

    clearBets();
  }, [clearBets]);

  return (
    <BaseButton
      loading={txLoading}
      loaderSize={20}
      onClick={clear}
      baseStyleOverride
      className="w-full bg-red-600 rounded-lg p-4 flex items-center justify-center h-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
        className="h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
    </BaseButton>
  );
};
