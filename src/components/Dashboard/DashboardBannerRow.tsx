import React, { useEffect, useState, useMemo } from "react";
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
  const venueLocation = useMemo(
    () => getVenuefromConfig(meet.meeting.jumperMeetingName, config),
    [meet, config]
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
    <div className="w-full shrink-0 h-full lg:shrink flex flex-col text-center hover:cursor-default">
      <span className="block">
        {`${meet.meeting.jumperMeetingName} (${meet.meeting.location}) - R${meet.jumperRaceNumber}`}
      </span>
      <span className="block font-semibold">{` ${timeString}`}</span>
    </div>
  );
};
