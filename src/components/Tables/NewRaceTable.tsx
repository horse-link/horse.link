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
        "flex w-full gap-x-4 border-x border-b border-hl-primary bg-hl-background-secondary p-4 text-hl-primary",
        {
          "line-through": scratchingArray.includes(runner.status)
        }
      )}
      onClick={() => onClickRunner(runner)}
    >
      <img
        src="/images/horse.webp"
        alt="HorseLink logo"
        className="h-[3rem] w-[4rem]"
      />
      <div className="w-full pt-1">
        <h2 className="w-full font-basement text-sm tracking-wider">
          {runner.number}. {runner.name} ({runner.barrier}){" "}
        </h2>
        <div className="mt-1 flex w-full gap-x-4 text-xs">
          <p>
            <span className="text-hl-secondary">F:</span> {runner.last5Starts}
          </p>
          <p>
            <span className="text-hl-secondary">W:</span>{" "}
            {runner.handicapWeight}KG
          </p>
        </div>
      </div>
      <p className="w-auto min-w-[70px] font-basement text-sm text-hl-secondary">
        {utils.formatting.formatToTwoDecimals(runner.odds.toString())}
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
        <div className="flex w-full items-center justify-between border border-hl-primary p-2">
          <span className="block">RUNNERS</span>
          <span className="block w-[5rem] text-hl-secondary">WIN</span>
        </div>
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
