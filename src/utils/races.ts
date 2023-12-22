import { Meet } from "../types/meets";
import { Race, RaceStatus, RaceWithResults, Runner } from "horselink-sdk";

import utils from "../utils";
import dayjs, { Dayjs } from "dayjs";

export const isScratchedRunner = (runner: Runner) =>
  ["LateScratched", "Scratched"].includes(runner.status);

export const createRacingLink = (race: Race, meet: Meet) =>
  race.status !== RaceStatus.PAYING
    ? `/races/${meet.id}/${race.number}`
    : `/results/${utils.markets.getPropositionIdFromRaceMeet(race, meet)}`;

export const createCellText = (race: RaceWithResults, now: Dayjs) => {
  const isAfterClosingTime = now.isAfter(dayjs(race.close));
  
  const timeString = utils.formatting.formatTimeToHMSFromNow(
    now,
    race.start!,
    true
  );

  return race.status == RaceStatus.PAYING
    ? race.results?.join(",")
    : race.status === RaceStatus.ABANDONED
    ? "ABND"
    : isAfterClosingTime
    ? "CLSD"
    : timeString;
};
