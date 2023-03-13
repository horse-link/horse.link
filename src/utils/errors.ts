import { ethers } from "ethers";

export const getMeaningfulMessage = (error: any) => {
  const stringified = JSON.stringify(error.message).toLowerCase();
  switch (true) {
    case stringified.includes("locked"):
      return "Locked time not passed";
    case stringified.includes("signature"):
      return "Invalid signature";
    case stringified.includes("date"):
      return "Invalid time";
    // include other cases that require a more descriptive error message here
  }

  const code = error.code as ethers.errors;
  switch (code) {
    case ethers.errors.ACTION_REJECTED:
      return "Action rejected";
    case ethers.errors.NETWORK_ERROR:
      return "Network error";
    case ethers.errors.INSUFFICIENT_FUNDS:
      return "Insufficient funds";
    case ethers.errors.UNPREDICTABLE_GAS_LIMIT:
      return "Invalid transaction";
    default:
      return `Unknown error encountered: ${error}`;
  }
};
