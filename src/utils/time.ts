const SECONDS = 60;
const HOURS = 24;

export const getDurationSplits = (duration: number) => {
  const days = Math.floor(duration / (SECONDS * SECONDS * HOURS));
  duration = duration - days * SECONDS * SECONDS * HOURS;
  const hours = Math.floor(duration / (SECONDS * SECONDS));
  duration = duration - hours * SECONDS * SECONDS;
  const minutes = Math.floor(duration / 60);
  duration = duration - minutes * 60;
  const seconds = duration;

  return {
    days,
    hours,
    minutes,
    seconds
  };
};
