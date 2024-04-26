import React from "react";
import { TotalBetsOnPropositions } from "../../types/bets";
import classNames from "classnames";
import { Loader } from "../Loader";
import { Back, Runner, RunnerStatus, formatting } from "horselink-sdk";

type Props = {
  runners?: Array<Runner>;
  totalBetsOnPropositions?: TotalBetsOnPropositions;
  setSelectedRunner: (runner?: Runner) => void;
  setIsModalOpen: (open: boolean) => void;
  closed: boolean;
};

export const RaceTable: React.FC<Props> = ({
  runners,
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

  const loading = [
    [
      <div key="racetable-loading-blank" />,
      <div className="py-4" key="racetable-loading-message">
        Loading...
      </div>
    ]
  ];

  const getOdds = (backs: Back[], type: string): string => {
    const back = backs.find(back => back.type === type);
    if (!back) return "0.00";

    return back.odds.toFixed(2);
  };

  const mapDesktopRunner = (runner: Runner, i: number) => {
    const style = classNames("w-full text-left py-4", {
      "line-through": scratchingArray.includes(runner.status)
    });

    return (
      <tr
        className={classNames("flex w-full justify-evenly", {
          "cursor-pointer hover:bg-hl-primary hover:!text-hl-secondary": !closed
        })}
        key={`table-rows-${i}`}
      >
        <td
          className={classNames("block w-full")}
          key={`table-row-data-number-${i}`}
        >
          <div
            className={style}
            key={`runnertable-${runner.number}-${i}`}
            onClick={() => onClickRunner(runner)}
          >
            {i}
          </div>
        </td>
        {/* runner name */}
        <td
          className={classNames("block w-full")}
          key={`table-row-data-runner-${i}`}
        >
          <div
            className={classNames(style, "text-hl-secondary")}
            key={`runnertable-${runner.number}-${i}`}
            onClick={() => onClickRunner(runner)}
          >
            {runner.name}
          </div>
        </td>
        {/* rider */}
        <td
          className={classNames("block w-full")}
          key={`table-row-data-rider-${i}`}
        >
          <div className={style} onClick={() => onClickRunner(runner)}>
            {runner.rider}
          </div>
        </td>
        {/* form */}
        <td
          className={classNames("block w-full")}
          key={`table-row-data-form-${i}`}
        >
          <div className={style} onClick={() => onClickRunner(runner)}>
            {runner.last5Starts}
          </div>
        </td>
        {/* win */}
        <td
          className={classNames("block w-full")}
          key={`table-row-data-odds-${i}`}
        >
          <div className={style} onClick={() => onClickRunner(runner)}>
            {getOdds(runner.backs, "win")}
          </div>
        </td>
        {/* place */}
        <td
          className={classNames("block w-full")}
          key={`table-row-data-place-${i}`}
        >
          <div className={style} onClick={() => onClickRunner(runner)}>
            {getOdds(runner.backs, "place")}
          </div>
        </td>
        {/* backed */}
        <td
          className={classNames("block w-full")}
          key={`table-row-data-backed-${i}`}
        >
          <div className={style} onClick={() => onClickRunner(runner)}>
            0
          </div>
        </td>
      </tr>
    );
  };

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
        {formatting.formatToTwoDecimals(runner.backs[0].odds.toString())}
      </p>
    </div>
  );

  return (
    <React.Fragment>
      {/* non-mobile */}
      <div className="hidden lg:block">
        {!runners?.length ? (
          loading
        ) : (
          <table className="block w-full border border-hl-border">
            <thead className="flex justify-evenly bg-hl-background-secondary px-4">
              <th>
                <div className="w-full py-4 text-left font-semibold text-hl-primary">
                  #
                </div>
              </th>
              <th>
                <div className="w-full py-4 text-left font-semibold text-hl-primary !text-hl-secondary">
                  Runner
                </div>
              </th>
              <th>
                <div className="w-full py-4 text-left font-semibold text-hl-primary">
                  Rider
                </div>
              </th>
              <th>
                <div className="w-full py-4 text-left font-semibold text-hl-primary">
                  Form
                </div>
              </th>
              <th>
                <div className="w-full py-4 text-left font-semibold text-hl-primary !text-hl-secondary">
                  Win
                </div>
              </th>
              <th>
                <div className="w-full py-4 text-left font-semibold text-hl-primary !text-hl-secondary">
                  Place
                </div>
              </th>
              <th>
                <div className="w-full py-4 text-left font-semibold text-hl-primary">
                  Backed
                </div>
              </th>
            </thead>
            <tbody className="flex flex-col divide-y divide-hl-border px-4">
              {runners?.map(
                (runner, i) => mapDesktopRunner(runner, i)
                // <tr
                //   className={classNames("flex w-full justify-evenly", {
                //     "cursor-pointer hover:bg-hl-primary hover:!text-hl-secondary":
                //       !closed
                //   })}
                //   key={`table-rows-${i}`}
                // >
                //   <td
                //     className={classNames("block w-full")}
                //     key={`table-row-data-${i}`}
                //   >
                //     <div
                //       className={classNames("w-full py-4 text-left")}
                //       key={`runnertable-${runner.proposition_id}-${i}`}
                //       onClick={() => onClickRunner(runner)}
                //     >
                //       {i}
                //     </div>
                //   </td>
                //   {/* runner name */}
                //   <td
                //     className={classNames("block w-full")}
                //     key={`table-row-data-${i}`}
                //   >
                //     <div
                //       className={classNames(
                //         "w-full py-4 text-left text-hl-secondary"
                //       )}
                //       key={`runnertable-${runner.proposition_id}-${i}`}
                //       onClick={() => onClickRunner(runner)}
                //     >
                //       {runner.name}
                //     </div>
                //   </td>
                //   {/* rider */}
                //   <td
                //     className={classNames("block w-full")}
                //     key={`table-row-data-${i}`}
                //   >
                //     <div
                //       className={classNames("w-full py-4 text-left")}
                //       onClick={() => onClickRunner(runner)}
                //     >
                //       {runner.rider}
                //     </div>
                //   </td>
                //   {/* form */}
                //   <td
                //     className={classNames("block w-full")}
                //     key={`table-row-data-${i}`}
                //   >
                //     <div
                //       className={classNames("w-full py-4 text-left")}
                //       onClick={() => onClickRunner(runner)}
                //     >
                //       {runner.last5Starts}
                //     </div>
                //   </td>
                //   {/* win */}
                //   <td
                //     className={classNames("block w-full")}
                //     key={`table-row-data-${i}`}
                //   >
                //     <div
                //       className={classNames("w-full py-4 text-left")}
                //       onClick={() => onClickRunner(runner)}
                //     >
                //       {runner.backs.length &&
                //         formatting.formatToTwoDecimals(
                //           runner.backs[0].odds.toString()
                //         )}
                //     </div>
                //   </td>
                //   {/* place */}
                //   <td
                //     className={classNames("block w-full")}
                //     key={`table-row-data-${i}`}
                //   >
                //     <div
                //       className={classNames("w-full py-4 text-left")}
                //       onClick={() => onClickRunner(runner)}
                //     >
                //       {runner.backs.length > 0 &&
                //         formatting.formatToTwoDecimals(
                //           runner.backs[1].odds.toString()
                //         )}
                //     </div>
                //   </td>
                //   {/* backed */}
                //   <td
                //     className={classNames("block w-full")}
                //     key={`table-row-data-${i}`}
                //   >
                //     <div
                //       className={classNames("w-full py-4 text-left")}
                //       onClick={() => onClickRunner(runner)}
                //     >
                //       0
                //     </div>
                //   </td>
              )}
            </tbody>
          </table>
        )}
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
