import React, { useEffect, useState } from "react";
import { NextToJump } from "../../types/meets";
import utils from "../../utils";

const INTERVAL = 1000;

type Props = {
  meet: NextToJump;
};

export const DashboardBannerRow: React.FC<Props> = ({ meet }) => {
  const [timeString, setTimeString] = useState(
    utils.formatting.formatTimeToMinutesAndSeconds(meet.jumperRaceStartTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(
        utils.formatting.formatTimeToMinutesAndSeconds(meet.jumperRaceStartTime)
      );
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [meet]);

  return (
    <div className="w-full shrink-0 h-full lg:shrink flex flex-col items-center">
      <span className="block">
        {`${meet.meeting.jumperMeetingName} (${meet.meeting.location}) - R${meet.jumperRaceNumber}`}
      </span>
      <span className="block font-semibold">{` ${timeString}`}</span>
    </div>
  );
};
