import { Meet, Race } from "../types/meets";
import { MILLIS_IN_DAY } from "./constants";

// MarketId 11 chars
// AAAAAABBBCC
// A = date as days since epoch
// B = location code
// C = race number
export const makeMarketId = (
  date: Date,
  location: string,
  raceNumber: string
) => {
  //Turn Date object into number of days since 1/1/1970, padded to 6 digits
  const daysSinceEpoch = Math.floor(date.getTime() / MILLIS_IN_DAY)
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
