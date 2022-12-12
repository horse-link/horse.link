import React from "react";
import classNames from "classnames";
import { BetFilterOptions } from "../../types/bets";

const options: Map<BetFilterOptions, string> = new Map([
  ["ALL_BETS", "All Bets"],
  ["PENDING", "Pending"],
  ["RESULTED", "Resulted"],
  ["SETTLED", "Settled"]
]);

type Props = {
  value: BetFilterOptions;
  onChange: (option: BetFilterOptions) => void;
  disabled: boolean;
};

export const BetFilterGroup: React.FC<Props> = ({
  value: currentOption,
  onChange,
  disabled
}) => (
  <div className="flex gap-3 flex-wrap">
    {[...options].map(([key, text]) => (
      <button
        onClick={() => {
          onChange(key);
        }}
        className={classNames(
          "bg-white rounded lg:px-2 shadow lg:w-28 w-13 px-1",
          {
            "bg-blue-500": key === currentOption,
            "disabled:opacity-75": key !== currentOption
          }
        )}
        disabled={disabled}
      >
        {text}
      </button>
    ))}
  </div>
);
