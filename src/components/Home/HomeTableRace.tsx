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

enum Status {
  Interim = "Interim",
  Abandoned = "Abandoned",
  Closed = "Closed",
  Normal = "Normal",
  Paying = "Paying"
}

export const HomeTableRace: React.FC<Props> = ({ race, meet }) => {
  const [timeString, setTimeString] = useState(
    utils.formatting.formatTimeToHMS(race.start!, true)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(utils.formatting.formatTimeToHMS(race.start!, true));
    }, constants.time.ONE_SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const isAfterClosingTime = dayjs().isAfter(dayjs(race.close));
  return (
    <Link
      className={classnames({
        "!cursor-default":
          race.status === Status.Interim ||
          race.status === Status.Abandoned ||
          race.status === Status.Closed ||
          (race.status === Status.Normal && isAfterClosingTime)
      })}
      to={
        race.status === Status.Normal ||
        (race.status === Status.Closed && !isAfterClosingTime)
          ? `/races/${meet.id}/${race.number}`
          : race.status === Status.Paying
          ? `/results/${utils.markets.getPropositionIdFromRaceMeet(race, meet)}`
          : // race status in any other condition other than normal or paying
            ""
      }
    >
      <div
        className={classnames("whitespace-nowrap px-3 py-4 text-sm", {
          "bg-gray-400 hover:bg-gray-500": race.status === Status.Paying,
          "bg-black text-white": race.status === Status.Abandoned,
          "bg-emerald-400": race.status === Status.Interim,
          "hover:bg-gray-200": race.status === Status.Normal
        })}
      >
        {dayjs.utc(race.start).local().format("H:mm")}
        <p>
          {race.status == Status.Paying
            ? race.results?.join(" ")
            : race.status == Status.Abandoned
            ? "ABND"
            : isAfterClosingTime
            ? "CLSD"
            : timeString}
        </p>
      </div>
    </Link>
  );
};
