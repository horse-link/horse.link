import utils from ".";
import { Runner } from "../types/meets";

export const getMarginOdds = (runner: Runner) => {
  const calculateMargin = (1 / runner.odds) * 100;
  return utils.formatting.formatToTwoDecimals(calculateMargin.toString());
};
