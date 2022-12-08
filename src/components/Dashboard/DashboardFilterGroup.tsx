import React from "react";
import classNames from "classnames";
import { MeetFilters } from "../../types/meets";

const options: Map<MeetFilters, string> = new Map([
  ["ALL", "All"],
  ["AUS_NZ", "AUS & NZ"],
  ["INTERNATIONAL", "International"]
]);

type Props = {
  value: MeetFilters;
  onChange: (option: MeetFilters) => void;
  disabled: boolean;
};

export const DashboardFilterGroup: React.FC<Props> = ({
  value: currentOption,
  onChange,
  disabled
}) => (
  <div className="flex gap-3">
    {[...options].map(([key, text]) => (
      <button
        key={key}
        onClick={() => {
          onChange(key);
        }}
        className={classNames("bg-white rounded px-2 shadow w-28", {
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
