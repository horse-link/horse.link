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
  return (
    <div className="flex flex-wrap">
      {meetRaces?.map((race: RaceInfo) => (
        <div key={`race${race.raceNumber}`} className="bg-red-200 flex">
          <Link
            className={classNames({
              "!cursor-default":
                race.status === "Interim" || race.status === "Abandoned"
            })}
            to={
              race.status === "Normal"
                ? `/horses/${params.track || ""}/${race.raceNumber}`
                : race.status === "Paying"
                ? `/results/${dayjs().format("YYYY-MM-DD")}_${params.track}_${
                    race.raceNumber
                  }_W1`
                : // race status in any other condition other than normal or paying
                  ""
            }
          >
            <div
              className={classNames("px-3 py-4 whitespace-nowrap text-sm", {
                "bg-gray-400 hover:bg-gray-500": race.status === "Paying",
                "bg-black text-white": race.status === "Abandoned",
                "bg-emerald-400": race.status === "Interim",
                "hover:bg-gray-200": race.status === "Normal"
              })}
            >
              <p>R{race.raceNumber}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
