import React from "react";
import { TotalBetsOnPropositions } from "../../types/bets";
import { Runner, RunnerStatus } from "../../types/meets";
import { NewTable } from "./NewTable";
import classNames from "classnames";
import { ethers } from "ethers";
import utils from "../../utils";
import { Loader } from "../Loader";

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
  const scratchingArray: Array<RunnerStatus> = ["Scratched", "LateScratched"];

  const onClickRunner = (runner: Runner) => {
    if (closed) return;

    setSelectedRunner(runner);
    setIsModalOpen(true);
  };

  const headers = [
    "#",
    "Runner",
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
      "line-through": scratchingArray.includes(runner.status)
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
          {key === "odds" && runner && runner[key]
            ? utils.formatting.formatToTwoDecimals(runner[key].toString())
            : runner[key]?.toString()}
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
        ...runners
          .filter(r => !scratchingArray.includes(r.status))
          .map(runnerMapping),
        ...runners
          .filter(r => scratchingArray.includes(r.status))
          .map(runnerMapping)
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

  const mapMobileRunner = (runner: Runner) => (
    <div
      key={JSON.stringify(runner)}
      className={classNames(
        "flex w-full flex-col items-center gap-y-2 border-t border-hl-border py-2 text-center",
        {
          "line-through": scratchingArray.includes(runner.status)
        }
      )}
      onClick={() => onClickRunner(runner)}
    >
      <h2 className="font-basement tracking-wider text-hl-secondary">
        {runner.number}: {runner.name}
      </h2>
      <div className="flex w-full items-center justify-center gap-x-8">
        <p>Form: {runner.last5Starts}</p>
        <p>Weight: {runner.handicapWeight}</p>
      </div>
      <p className="text-hl-secondary">
        Win: {utils.formatting.formatToTwoDecimals(runner.odds.toString())}
      </p>
    </div>
  );

  return (
    <React.Fragment>
      {/* non-mobile */}
      <div className="hidden lg:block">
        <NewTable
          headers={headers}
          headerStyles="font-basement tracking-wider"
          rows={!runners?.length ? loading : rows}
          rowStyles={classNames({
            "hover:bg-hl-primary cursor-pointer hover:!text-hl-secondary":
              !closed
          })}
        />
      </div>

      {/* mobile */}
      <div className="block lg:hidden">
        {!runners?.length ? (
          <div className="flex w-full justify-center py-10">
            <Loader />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            {runners
              .filter(r => !scratchingArray.includes(r.status))
              .map(mapMobileRunner)}
            {runners
              .filter(r => scratchingArray.includes(r.status))
              .map(mapMobileRunner)}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
