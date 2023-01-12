import classNames from "classnames";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { RaceInfo } from "../../types/meets";

type Props = {
  meetRaces: RaceInfo[];
  params: any;
};

export const RacesButton: React.FC<Props> = ({ meetRaces, params }) => {
  const url = meetRaces?.map((race: RaceInfo) => {
    console.log(race.raceStatus);
    return race.raceStatus === "Normal"
      ? `/horses/${params.track || ""}/${race.raceNumber}`
      : race.raceStatus === "Paying"
      ? `/results/${dayjs().format("YYYY-MM-DD")}_${params.track}_${
          race.raceNumber
        }_W1`
      : // race raceStatus in any other condition other than normal or paying
        "";
  });

  console.log(url);

  return (
    <div className="flex flex-wrap">
      {meetRaces?.map((race: RaceInfo) => (
        <div
          key={`race${race.raceNumber}`}
          className="flex justify-between rounded-full mr-1 bg-emerald-400 hover:bg-gray-100"
        >
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
                "px-3 py-3 whitespace-nowrap text-sm rounded-full",
                {
                  "bg-gray-400 hover:bg-gray-500": race.raceStatus === "Paying",
                  "bg-black text-white": race.raceStatus === "Abandoned",
                  "bg-emerald-400": race.raceStatus === "Interim",
                  "hover:bg-gray-200": race.raceStatus === "Normal",
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
  );
};
