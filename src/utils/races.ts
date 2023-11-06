import { Runner, Meet } from "../types/meets";
// import { RaceStatus } from "../constants/status";
import { Race, RaceStatus } from "horselink-sdk";

import { constants } from "horselink-sdk/src";

// import { constants } from "horselink-sdk";

import utils from "../utils";
import dayjs, { Dayjs } from "dayjs";

export const isScratchedRunner = (runner: Runner) =>
  ["LateScratched", "Scratched"].includes(runner.status);

export const createRacingLink = (race: Race, meet: Meet) =>
  race.status !== RaceStatus.PAYING
    ? `/races/${meet.id}/${race.number}`
    : `/results/${utils.markets.getPropositionIdFromRaceMeet(race, meet)}`;

export const createCellText = (race: Race, now: Dayjs) => {
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
