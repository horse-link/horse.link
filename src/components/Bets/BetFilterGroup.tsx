import classNames from "classnames";
import { FilterOptions } from "src/types";

const options: Map<FilterOptions, string> = new Map([
  ["ALL_BETS", "All Bets"],
  ["PENDING", "Pending"],
  ["RESULTED", "Resulted"],
  ["SETTLED", "Settled"]
]);

type Props = {
  value: FilterOptions;
  onChange: (option: FilterOptions) => void;
  disabled: boolean;
};

export const BetFilterGroup = ({
  value: currentOption,
  onChange,
  disabled
}: Props) => {
  return (
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
};
