import React from "react";
import { MeetFilters } from "horselink-sdk";
import { Button } from "../Buttons";

// TODO: Remove these duplicate types
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
  <div className="flex gap-x-4">
    {[...options].map(([key, text]) => (
      <Button
        text={text}
        onClick={() => onChange(key)}
        key={key}
        disabled={disabled}
        active={currentOption === key}
      />
    ))}
  </div>
);
