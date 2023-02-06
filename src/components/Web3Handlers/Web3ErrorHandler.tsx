import { ethers } from "ethers";
import React, { useMemo } from "react";

type Props = {
  error: any;
};

export const Web3ErrorHandler: React.FC<Props> = ({ error }) => {
  const message = useMemo(() => {
    console.error(error);

    const stringified = JSON.stringify(error.message).toLowerCase();
    switch (true) {
      case stringified.includes("locked"):
        return "Locked time not passed";
      case stringified.includes("signature"):
        return "Invalid signature";
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
        return "Gas limit unpredictable";
      default:
        return `Unknown error encountered: ${error}`;
    }
  }, [error]);

  return (
    <div className="mt-6 flex flex-col items-center rounded-md bg-red-600 px-2 py-4">
      <h4 className="mb-1 text-lg font-semibold">Error:</h4>
      <span className="block max-w-[40ch] overflow-hidden overflow-ellipsis">
        {message}
      </span>
    </div>
  );
};
