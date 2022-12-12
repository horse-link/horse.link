import { Meet, Race } from "../types/meets";
import dayjs from "dayjs";

// copied from BE repo
export const makeMarketId = (
  date: Date,
  location: string,
  raceNumber: string
) => {
  const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
  const offset = date.getTimezoneOffset();
  const dateInTimezone = dayjs(date).subtract(offset, "minutes");
  const daysSinceEpoch = Math.floor(dateInTimezone.valueOf() / MILLIS_IN_DAY)
    .toString()
    .padStart(6, "0");
  return `${daysSinceEpoch}${location}${raceNumber
    .toString()
    .padStart(2, "0")}`;
};

export const getPropositionIdFromRaceMeet = (race: Race, meet: Meet) =>
  `${meet.date}_${meet.id}_${race.number}_W1`;

export const getDetailsFromPropositionId = (marketId: string) => {
  const split = marketId.split("_");

  return {
    date: split[0],
    track: split[1],
    race: split[2]
  };
};
