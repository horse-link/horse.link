import dayjs from "dayjs";

export const getPropositionFromId = (propositionId: string) =>
  propositionId.slice(-2);

export const getMarketDetailsFromId = (marketId: string) => {
  const timestamp = marketId.slice(0, 6);
  const location = marketId.slice(6, 9);
  const raceNumber = marketId.slice(-2);
  const date = dayjs(0)
    .add(+timestamp, "days")
    .format("DD-MM-YYYY");
  return {
    date,
    location,
    raceNumber
  };
};
