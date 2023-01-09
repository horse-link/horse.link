import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NextToJump } from "../../types/meets";
import utils from "../../utils";
import { Config } from "../../types/config";
import { getVenuefromConfig } from "../../utils/config";

const INTERVAL = 1000;

type Props = {
  meet: NextToJump;
  config?: Config;
};

export const DashboardBannerRow: React.FC<Props> = ({ meet, config }) => {
  const [timeString, setTimeString] = useState(
    utils.formatting.formatTimeToHMS(meet.jumperRaceStartTime)
  );
  const venueLocation = getVenuefromConfig(
    meet.meeting.jumperMeetingName,
    config
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(utils.formatting.formatTimeToHMS(meet.jumperRaceStartTime));
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [meet]);

  return venueLocation ? (
    <Link
      className="w-full shrink-0 h-full lg:shrink flex flex-col text-center hover:bg-indigo-900 p-2"
      to={`/horses/${venueLocation}/${meet.jumperRaceNumber}`}
    >
      <div>
        <span className="block">
          {`${meet.meeting.jumperMeetingName} (${meet.meeting.location}) - R${meet.jumperRaceNumber}`}
        </span>
        <span className="block font-semibold">{` ${timeString}`}</span>
      </div>
    </Link>
  ) : (
    <div className="w-full shrink-0 h-full lg:shrink flex flex-col text-center hover:bg-green-700 p-2">
      <span className="block">
        {`${meet.meeting.jumperMeetingName} (${meet.meeting.location}) - R${meet.jumperRaceNumber}`}
      </span>
      <span className="block font-semibold">{` ${timeString}`}</span>
    </div>
  );
};
