import { Runner } from "../types/meets";

export const isScratchedRunner = (runner: Runner) =>
  ["LateScratched", "Scratched"].includes(runner.status);
