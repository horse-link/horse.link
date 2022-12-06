import { Meet, Race } from "../types/meets";

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
