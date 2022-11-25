import { ethers } from "ethers";
import React, { useMemo } from "react";

type Props = {
  error: ethers.errors;
};

export const Web3ErrorHandler: React.FC<Props> = ({ error }) => {
  const message = useMemo(() => {
    switch (error) {
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
    <div className="mt-6 px-2 py-4 bg-red-600 rounded-md flex flex-col items-center">
      <h4 className="font-semibold mb-1 text-lg">Error:</h4>
      <span className="block overflow-ellipsis max-w-[40ch] overflow-hidden">
        {message}
      </span>
    </div>
  );
};
