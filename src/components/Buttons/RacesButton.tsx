import classNames from "classnames";
import dayjs from "dayjs";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link, Params } from "react-router-dom";
import { RaceInfo } from "../../types/meets";
import { RaceStatus } from "../../constants/status";

type Props = {
  meetRaces?: RaceInfo[];
  params: Params<string>;
};

export const RacesButton: React.FC<Props> = ({ meetRaces, params }) => {
  return params && meetRaces ? (
    <div className="flex flex-wrap">
      {meetRaces.map(race => (
        <div key={`race${race.raceNumber}`} className="flex justify-between">
          <Link
            className={classNames({
              "!cursor-default":
                race.raceStatus === RaceStatus.INTERIM ||
                race.raceStatus === RaceStatus.ABANDONED
            })}
            to={
              race.raceStatus === RaceStatus.NORMAL
                ? `/races/${params.track || ""}/${race.raceNumber}`
                : race.raceStatus === RaceStatus.PAYING
                ? `/results/${dayjs().format("YYYY-MM-DD")}_${params.track}_${
                    race.raceNumber
                  }_W1`
                : // race raceStatus in any other condition other than normal or paying
                  ""
            }
          >
            <div
              className={classNames(
                "-p-3 mt- mr-1 h-11 w-11 whitespace-nowrap rounded-full pt-3 text-sm",
                {
                  "bg-gray-400 hover:bg-gray-500":
                    race.raceStatus === RaceStatus.PAYING &&
                    race.raceNumber.toString() != params.number,
                  "bg-black text-white hover:bg-gray-100":
                    race.raceStatus === RaceStatus.ABANDONED,
                  "bg-emerald-200 ": race.raceStatus === RaceStatus.INTERIM,
                  "bg-emerald-400 hover:bg-gray-200":
                    race.raceStatus === RaceStatus.NORMAL &&
                    race.raceNumber.toString() != params.number,
                  "bg-emerald-400": race.raceStatus === RaceStatus.CLOSED,
                  "bg-white": race.raceNumber.toString() == params.number
                }
              )}
            >
              <p className="text-center">R{race.raceNumber}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-wrap rounded-full">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton
          key={i}
          height={40}
          width={40}
          circle={true}
          className="ml-1"
        />
      ))}
    </div>
  );
};
