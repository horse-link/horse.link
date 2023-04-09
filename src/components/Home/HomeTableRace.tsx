import React, { useEffect, useState } from "react";
import { Meet, Race } from "../../types/meets";
import dayjs from "dayjs";
import classnames from "classnames";
import { Link } from "react-router-dom";
import utils from "../../utils";
import constants from "../../constants";
import { RaceStatus } from "../../constants/status";

type Props = {
  race: Race;
  meet: Meet;
};

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
          race.status === RaceStatus.Interim ||
          race.status === RaceStatus.Abandoned ||
          race.status === RaceStatus.Closed ||
          (race.status === RaceStatus.Normal && isAfterClosingTime)
      })}
      to={
        (race.status === RaceStatus.Normal ||
          race.status === RaceStatus.Closed) &&
        !isAfterClosingTime
          ? `/races/${meet.id}/${race.number}`
          : race.status === RaceStatus.Paying
          ? `/results/${utils.markets.getPropositionIdFromRaceMeet(race, meet)}`
          : // race status in any other condition other than normal or paying
            ""
      }
    >
      <div
        className={classnames("whitespace-nowrap px-3 py-4 text-sm", {
          "bg-gray-400 hover:bg-gray-500": race.status === RaceStatus.Paying,
          "bg-black text-white": race.status === RaceStatus.Abandoned,
          "bg-emerald-400": race.status === RaceStatus.Interim,
          "hover:bg-gray-200": race.status === RaceStatus.Normal
        })}
      >
        {dayjs.utc(race.start).local().format("H:mm")}
        <p>
          {race.status == RaceStatus.Paying
            ? race.results?.join(" ")
            : race.status == RaceStatus.Abandoned
            ? "ABND"
            : isAfterClosingTime
            ? "CLSD"
            : timeString}
        </p>
      </div>
    </Link>
  );
};
