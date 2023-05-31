import { Race, Runner, Meet } from "../types/meets";
import { RaceStatus } from "../constants/status";
import utils from "../utils";
import dayjs, { Dayjs } from "dayjs";
import { ethers } from "ethers";
import constants from "../constants";

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
    ? race.results?.join(", ")
    : race.status === RaceStatus.ABANDONED
    ? "ABND"
    : isAfterClosingTime
    ? "CLSD"
    : timeString;
};

export const calculateRaceMargin = (odds: number[]) => {
  // all ones case
  if (odds.every(odd => odd == 1)) {
    return "1";
  }

  // if odds arent present, use 1 odds (prevents division by zero error)
  const filteredOdds = odds.map(o => o || 1);

  const bnOdds = filteredOdds.map(o => ethers.utils.parseEther(o.toString()));
  const oneOverOdds = bnOdds.map(o =>
    constants.blockchain.ONE_ETHER.mul(ethers.constants.WeiPerEther).div(o)
  );

  const summed = oneOverOdds.reduce(
    (sum, cur) => sum.add(cur),
    ethers.constants.Zero
  );

  return ethers.utils.formatEther(summed);
};
