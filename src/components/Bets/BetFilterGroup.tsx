import React from "react";
import { BetFilterOptions } from "../../types/bets";
import { Button } from "../Buttons";

const options: Map<BetFilterOptions, string> = new Map([
  ["ALL_BETS", "All"],
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
      <Button
        autoWidth
        text={text}
        key={key}
        onClick={() => onChange(key)}
        disabled={disabled}
        active={key === currentOption}
      />
    ))}
  </div>
);
