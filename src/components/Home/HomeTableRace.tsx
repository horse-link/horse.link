import React from "react";
import { Meet, Race } from "../../types/meets";
import dayjs, { Dayjs } from "dayjs";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { RaceStatus } from "../../constants/status";
import utils from "../../utils/";

type Props = {
  race: Race;
  meet: Meet;
  now: Dayjs;
};

export const HomeTableRace: React.FC<Props> = ({ race, meet, now }) => {
  return (
    <Link
      className={classnames({
        "!cursor-default": race.status === RaceStatus.ABANDONED
      })}
      to={utils.races.createRacingLink(race, meet)}
    >
      <div
        className={classnames("whitespace-nowrap px-3 py-4 text-sm", {
          "bg-gray-400 hover:bg-gray-500": race.status === RaceStatus.PAYING,
          "bg-black text-white": race.status === RaceStatus.ABANDONED,
          "bg-emerald-400": race.status === RaceStatus.INTERIM,
          "hover:bg-gray-200": race.status === RaceStatus.NORMAL
        })}
      >
        {dayjs.utc(race.start).local().format("H:mm")}
        <p>{utils.races.createCellText(race, now)}</p>
      </div>
    </Link>
  );
};
