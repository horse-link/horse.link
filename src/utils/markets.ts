import { Meet, Race } from "../types/meets";

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
  const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
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
