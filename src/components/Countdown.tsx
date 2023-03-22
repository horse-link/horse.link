import React from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utils from "../utils";

dayjs.extend(duration);

type Props = {
  eventTimestamp: number;
  now: number;
  isEventInFuture: boolean;
};

export const Countdown: React.FC<Props> = ({
  eventTimestamp,
  now,
  isEventInFuture
}) => {
  const timeUntilEvent = dayjs.duration(
    +dayjs(now).diff(dayjs(eventTimestamp)) * -1
  );
  const { days, hours, minutes, seconds } =
    utils.time.getDurationSplits(timeUntilEvent);

  return !eventTimestamp || !isEventInFuture ? null : (
    <div className="mt-12 flex w-full flex-col items-center justify-center">
      <p className="mb-8 text-xl font-bold lg:text-7xl">Tournament Jumps In:</p>
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
