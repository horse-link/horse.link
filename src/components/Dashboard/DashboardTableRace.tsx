import React, { useEffect, useState } from "react";
import { Meet, Race } from "../../types/meets";
import dayjs from "dayjs";
import classnames from "classnames";
import { Link } from "react-router-dom";
import utils from "../../utils";
import constants from "../../constants";

type Props = {
  race: Race;
  meet: Meet;
};

export const DashboardTableRace: React.FC<Props> = ({ race, meet }) => {
  const [timeString, setTimeString] = useState(
    utils.formatting.formatTimeToHMS(race.close!, true)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(utils.formatting.formatTimeToHMS(race.close!, true));
    }, constants.time.ONE_SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const isAfterClosingTime = dayjs().isAfter(dayjs(race.close));
  return (
    <Link
      className={classnames({
        "!cursor-default":
          race.status === "Interim" ||
          race.status === "Abandoned" ||
          race.status === "Closed" ||
          (race.status === "Normal" && isAfterClosingTime)
      })}
      to={
        race.status === "Normal" && !isAfterClosingTime
          ? `/races/${meet.id}/${race.number}`
          : race.status === "Paying"
          ? `/results/${utils.markets.getPropositionIdFromRaceMeet(race, meet)}`
          : // race status in any other condition other than normal or paying
            ""
      }
    >
      <div
        className={classnames("px-3 py-4 whitespace-nowrap text-sm", {
          "bg-gray-400 hover:bg-gray-500": race.status === "Paying",
          "bg-black text-white": race.status === "Abandoned",
          "bg-emerald-400": race.status === "Interim",
          "hover:bg-gray-200": race.status === "Normal"
        })}
      >
        <p>R{race.number}</p>
        {dayjs.utc(race.start).local().format("H:mm")}
        <p>
          {race.status == "Paying"
            ? race.results?.join(" ")
            : race.status == "Abandoned"
            ? "ABND"
            : isAfterClosingTime
            ? "CLSD"
            : timeString}
        </p>
      </div>
    </Link>
  );
};
