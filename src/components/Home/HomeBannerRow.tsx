import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NextToJumpRace } from "../../types/meets";
import utils from "../../utils";
import constants from "../../constants";
import classNames from "classnames";

type Props = {
  meet: NextToJumpRace;
};

export const HomeBannerRow: React.FC<Props> = ({ meet }) => {
  const [timeString, setTimeString] = useState(
    utils.formatting.formatTimeToHMS(meet.jumperRaceStartTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(utils.formatting.formatTimeToHMS(meet.jumperRaceStartTime));
    }, constants.time.ONE_SECOND_MS);

    return () => clearInterval(interval);
  }, [meet]);

  return (
    <Link
      className={classNames(
        "flex w-fit items-center gap-x-2 rounded-lg border border-hl-border px-3 py-4 lg:w-full lg:px-4 lg:py-8"
      )}
      to={`/races/${meet.meeting.venueCode}/${meet.jumperRaceNumber}`}
    >
      <img
        src="/images/horse.webp"
        alt="HorseLink logo"
        className="max-w-[2rem] lg:max-w-[3rem]"
      />
      <div className="w-full whitespace-nowrap text-[10px] lg:whitespace-normal lg:text-xs">
        <dt className="break-words font-basement tracking-wider">
          {meet.meeting.location} ({meet.meeting.venueCode})
        </dt>
        <dd className="flex gap-x-4 font-normal">
          <p className="text-hl-tertiary">RACE {meet.jumperRaceNumber}</p>
          <p className="text-hl-secondary">{timeString}</p>
        </dd>
      </div>
    </Link>
  );
};
