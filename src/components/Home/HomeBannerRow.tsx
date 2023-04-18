import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NextToJumpRace } from "../../types/meets";
import utils from "../../utils";
import constants from "../../constants";
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
      className="flex w-full shrink items-center gap-x-2 rounded-lg border border-hl-border px-4 py-8"
      to={`/races/${meet.meeting.venueCode}/${meet.jumperRaceNumber}`}
    >
      <img
        src="/images/horse.webp"
        alt="HorseLink logo"
        className="max-w-[4rem]"
      />
      <div className="w-full">
        <dt className="font-basement font-bold">
          {meet.meeting.location} ({meet.meeting.jumperMeetingName})
        </dt>
        <dd className="flex gap-x-4 text-sm font-normal">
          <p className="text-hl-tertiary">RACE {meet.jumperRaceNumber}</p>
          <p className="text-hl-secondary">{timeString}</p>
        </dd>
      </div>
    </Link>
  );
};
