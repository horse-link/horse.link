import { Runner } from "../types/meets";
import { ethers } from "ethers";

export const isScratchedRunner = (runner: Runner) =>
  ["LateScratched", "Scratched"].includes(runner.status);

export const calculateRaceMargin = (odds: number[]) => {
  const one = ethers.utils.parseEther("1");

  // if odds arent present, use 1 odds
  const filteredOdds = odds.map(o => (!o ? 1 : o));

  const bnOdds = filteredOdds.map(o => ethers.utils.parseEther(o.toString()));
  const oneOverOdds = bnOdds.map(o =>
    one.mul(ethers.constants.WeiPerEther).div(o)
  );

  const summed = oneOverOdds.reduce(
    (sum, cur) => sum.add(cur),
    ethers.constants.Zero
  );

  return ethers.utils.formatEther(summed);
};
