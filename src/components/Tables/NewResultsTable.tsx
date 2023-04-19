import React from "react";
import { MeetResults } from "../../types/meets";
import { NewTable } from "./NewTable";
import classNames from "classnames";
import utils from "../../utils";

type Props = {
  results?: MeetResults;
};

export const NewResultsTable: React.FC<Props> = ({ results }) => {
  const headers = ["#", "Runner", "Number", "Rider"].map((text, i) => (
    <div
      key={`racetable-${text}-${i}`}
      className={classNames(
        "w-full py-4 text-left font-semibold text-hl-primary",
        {
          "!text-hl-secondary": i === 1
        }
      )}
    >
      {text}
    </div>
  ));

  const rows = results
    ? results.winningHorses.map(horse =>
        (
          ["place", "runner", "number", "rider"] as Array<keyof typeof horse>
        ).map((key, i) => {
          const style = "w-full text-left py-4";

          return (
            <div
              className={classNames(style, {
                "text-hl-secondary": i === 1
              })}
              key={`resultstable-${horse.number}-${key.toString()}-${i}`}
            >
              {key === "place"
                ? utils.formatting.formatOrdinals(horse.place)
                : horse[key].toString()}
            </div>
          );
        })
      )
    : [];

  return <NewTable headers={headers} rows={rows} />;
};
