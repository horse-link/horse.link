import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import classNames from "classnames";
import utils from "../utils";
import constants from "../constants";

dayjs.extend(duration);

type Props = {
  large?: boolean;
  containerStyles?: string;
  setShowLeaderboard: (show: boolean) => void;
};

export const Countdown: React.FC<Props> = ({
  large,
  containerStyles,
  setShowLeaderboard
}) => {
  const [now, setNow] = useState(Date.now());

  const eventTimestamp = +(constants.env.EVENT_TS || "0");
  const isEventInFuture = dayjs(now).isBefore(dayjs(eventTimestamp));

  const timeUntilEvent = dayjs.duration(
    +dayjs(now).diff(dayjs(eventTimestamp)) * -1
  );
  const { days, hours, minutes, seconds } =
    utils.time.getDurationSplits(timeUntilEvent);

  useEffect(() => {
    const interval = setInterval(
      () => setNow(Date.now()),
      1 * constants.time.ONE_SECOND_MS
    );

    return () => clearInterval(interval);
  }, []);
  setShowLeaderboard(!isEventInFuture);

  return !eventTimestamp || !isEventInFuture ? null : (
    <div
      className={classNames(
        "mt-8 flex w-full flex-col items-center justify-center",
        {
          [containerStyles!]: !!containerStyles
        }
      )}
    >
      <p
        className={classNames("text-xl font-bold", {
          "mb-4": !large,
          "mb-8 lg:text-7xl": large
        })}
      >
        Tournament Jumps In:
      </p>
      <div className="grid grid-cols-2 grid-rows-2 gap-6 lg:flex">
        <div className="rounded-md bg-white p-6 text-center text-xl font-bold">
          <p>{days}</p>
          <p>days</p>
        </div>
        <div className="rounded-md bg-white p-6 text-center text-xl font-bold">
          <p>{hours}</p>
          <p>hours</p>
        </div>
        <div className="rounded-md bg-white p-6 text-center text-xl font-bold">
          <p>{minutes}</p>
          <p>minutes</p>
        </div>
        <div className="rounded-md bg-white p-6 text-center text-xl font-bold">
          <p>{seconds}</p>
          <p>seconds</p>
        </div>
      </div>
    </div>
  );
};
