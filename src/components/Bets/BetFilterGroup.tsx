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
  <div className="flex flex-wrap gap-3">
    {[...options].map(([key, text]) => (
      <button
        key={key}
        onClick={() => {
          onChange(key);
        }}
        className={classNames(
          "w-13 rounded bg-white px-1 shadow lg:w-28 lg:px-2",
          {
            "!bg-indigo-700 text-white": key === currentOption,
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
