import { Duration } from "dayjs/plugin/duration";

export const getDurationSplits = (duration: Duration) => ({
  days: duration.days(),
  hours: duration.hours(),
  minutes: duration.minutes(),
  seconds: duration.seconds()
});
