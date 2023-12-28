import { Meet, Race } from "horselink-sdk";

export const getPropositionIdFromRaceMeet = (race: Race, meet: Meet) =>
  `${meet.date}_${meet.id}_${race.number}_W1`;

export const getDetailsFromPropositionId = (propositionId: string) => {
  const split = propositionId.split("_");

  return {
    date: split[0],
    track: split[1],
    race: split[2]
  };
};

export const getMarketIdFromPropositionId = (propositionId: string) => {
  // example propositionId: "019508DBN08W07"
  // marketId is the propositionId with the final 3 chars (Wxx) sliced off

  return propositionId.slice(0, -3);
};
