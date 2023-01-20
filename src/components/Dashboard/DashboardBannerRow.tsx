import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NextToJump } from "../../types/meets";
import utils from "../../utils";
import constants from "../../constants";

type Props = {
  meet: NextToJump;
};

export const DashboardBannerRow: React.FC<Props> = ({ meet }) => {
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
      className="w-full shrink-0 h-full lg:shrink flex flex-col text-center p-2 hover:bg-indigo-900"
      to={`/races/${meet.meeting.venueCode}/${meet.jumperRaceNumber}`}
    >
      <span className="block">
        {`${meet.meeting.jumperMeetingName} (${meet.meeting.location}) - R${meet.jumperRaceNumber}`}
      </span>
      <span className="block font-semibold">{` ${timeString}`}</span>
    </Link>
  );
};
