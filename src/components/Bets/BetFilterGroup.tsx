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

export const BetFilterGroup = ({
  value: currentOption,
  onChange,
  disabled
}: Props) => (
  <div className="flex gap-3">
    {[...options].map(([key, text]) => (
      <button
        onClick={() => {
          onChange(key);
        }}
        className={classNames("bg-white rounded px-2 shadow ", {
          "bg-blue-500": key === currentOption,
          "disabled:opacity-75": key !== currentOption
        })}
        disabled={disabled}
      >
        {text}
      </button>
    ))}
  </div>
);
