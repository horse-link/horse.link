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

export const HomeFilterGroup: React.FC<Props> = ({
  value: currentOption,
  onChange,
  disabled
}) => (
  <React.Fragment>
    {[...options].map(([key, text]) => (
      <button
        key={key}
        onClick={() => {
          onChange(key);
        }}
        className={classNames(
          "w-full rounded bg-white text-sm md:w-28 md:text-base ",
          {
            "bg-indigo-700 text-white":
              key.toLowerCase() === currentOption.toLowerCase(),
            "disabled:opacity-75 hover:bg-gray-200":
              key.toLowerCase() !== currentOption.toLowerCase()
          }
        )}
        disabled={disabled}
      >
        {text}
      </button>
    ))}
  </React.Fragment>
);
