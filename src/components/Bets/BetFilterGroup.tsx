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
        key={key}
        onClick={() => {
          onChange(key);
        }}
        className={classNames(
          "bg-white rounded px-1 w-13 lg:px-2 shadow lg:w-28",
          {
            "bg-indigo-700 text-white": key === currentOption,
            "disabled:opacity-75 hover:bg-gray-200": key !== currentOption
          }
        )}
        disabled={disabled}
      >
        {text}
      </button>
    ))}
  </div>
);
