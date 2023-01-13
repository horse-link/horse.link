import classNames from "classnames";
import dayjs from "dayjs";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { RaceInfo } from "../../types/meets";

type Props = {
  meetRaces?: RaceInfo[];
  params: any;
};

export const RacesButton: React.FC<Props> = ({ meetRaces, params }) => {
  return params && meetRaces ? (
    <div className="flex flex-wrap">
      {meetRaces?.map((race: RaceInfo) => (
        <div key={`race${race.raceNumber}`} className="flex justify-between">
          <Link
            className={classNames({
              "!cursor-default":
                race.raceStatus === "Interim" || race.raceStatus === "Abandoned"
            })}
            to={
              race.raceStatus === "Normal"
                ? `/horses/${params.track || ""}/${race.raceNumber}`
                : race.raceStatus === "Paying"
                ? `/results/${dayjs().format("YYYY-MM-DD")}_${params.track}_${
                    race.raceNumber
                  }_W1`
                : // race raceStatus in any other condition other than normal or paying
                  ""
            }
          >
            <div
              className={classNames(
                "px-3 py-3 mt-1 mr-1 whitespace-nowrap text-sm rounded-full hover:bg-gray-100",
                {
                  "bg-gray-400 hover:bg-gray-500":
                    race.raceStatus === "Paying" &&
                    race.raceNumber != params.number,
                  "bg-black text-white": race.raceStatus === "Abandoned",
                  "bg-emerald-400": race.raceStatus === "Interim",
                  "hover:bg-gray-200 bg-emerald-400":
                    race.raceStatus === "Normal" &&
                    race.raceNumber != params.number,
                  "bg-emerald-500": race.raceStatus === "Closed",
                  "bg-white": race.raceNumber == params.number
                }
              )}
            >
              <p>R{race.raceNumber}</p>
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
