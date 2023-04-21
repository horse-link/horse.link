import React from "react";
import { TotalBetsOnPropositions } from "../../types/bets";
import { Runner } from "../../types/meets";
import { NewTable } from "./NewTable";
import classNames from "classnames";
import { ethers } from "ethers";
import utils from "../../utils";

type Props = {
  runners?: Array<Runner>;
  totalBetsOnPropositions?: TotalBetsOnPropositions;
  setSelectedRunner: (runner?: Runner) => void;
  setIsModalOpen: (open: boolean) => void;
  closed: boolean;
};

export const NewRaceTable: React.FC<Props> = ({
  runners,
  totalBetsOnPropositions,
  setSelectedRunner,
  setIsModalOpen,
  closed
}) => {
  const onClickRunner = (runner: Runner) => {
    if (closed) return;

    setSelectedRunner(runner);
    setIsModalOpen(true);
  };

  const headers = [
    "#",
    "Runner (Barrier)",
    "Form",
    "Weight",
    "Win",
    "Backed",
    "Proposition"
  ].map((text, i) => (
    <div
      key={`racetable-${text}-${i}`}
      className={classNames(
        "w-full py-4 text-left font-semibold text-hl-primary",
        {
          "!text-hl-secondary": [1, 4, 7].includes(i)
        }
      )}
    >
      {text}
    </div>
  ));

  const runnerMapping = (runner: Runner, i: number) => {
    const stats = totalBetsOnPropositions?.[runner.proposition_id || ""];
    const formattedBacked = stats
      ? ethers.utils.formatEther((+stats.amount).toString())
      : "0.0000";

    const style = classNames("w-full text-left py-4", {
      "line-through": runner.status != "Open"
    });

    return [
      ...(
        ["number", "name", "last5Starts", "handicapWeight", "odds"] as Array<
          keyof typeof runner
        >
      ).map((key, i) => (
        <div
          className={classNames(style, {
            "text-hl-secondary": [1, 4].includes(i)
          })}
          key={`runnertable-${runner.proposition_id}-${key.toString()}-${i}`}
          onClick={() => onClickRunner(runner)}
        >
          {key === "odds"
            ? utils.formatting.formatToTwoDecimals(runner[key].toString())
            : runner[key].toString()}
        </div>
      )),
      <div
        className={style}
        key={`runnertable-${runner.proposition_id}-${i}`}
        onClick={() => onClickRunner(runner)}
      >
        {utils.formatting.formatToFourDecimals(formattedBacked)}
      </div>,
      <div
        className={classNames(style, "text-hl-secondary")}
        key={`runnertable-${runner.proposition_id}-${i}`}
        onClick={() => onClickRunner(runner)}
      >
        {utils.formatting.formatToFourDecimals(
          stats?.percentage.toString() || "0"
        )}
      </div>
    ];
  };

  const rows = runners
    ? [
        ...runners.filter(r => r.status === "Open").map(runnerMapping),
        ...runners.filter(r => r.status != "Open").map(runnerMapping)
      ]
    : [];

  const loading = [
    [
      <div key="racetable-loading-blank" />,
      <div className="py-4" key="racetable-loading-message">
        Loading...
      </div>
    ]
  ];

  return (
    <NewTable
      headers={headers}
      headerStyles="font-basement tracking-wider"
      rows={!runners?.length ? loading : rows}
      rowStyles={classNames({
        "hover:bg-hl-primary cursor-pointer hover:!text-hl-secondary": !closed
      })}
    />
  );
};
