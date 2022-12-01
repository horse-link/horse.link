import React from "react";
import utils from "../../utils";

type Props = {
  hash: string;
};

export const Web3SuccessHandler: React.FC<Props> = ({ hash }) => {
  return (
    <div className="mt-6 px-2 py-4 bg-emerald-400 rounded-md flex flex-col items-center">
      <h4 className="font-semibold mb-1 text-lg">Success!</h4>
      <span className="block">
        Tx Hash:{" "}
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href={`${process.env.VITE_SCANNER_URL}/tx/${hash}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {utils.formatting.shortenAddress(hash)}
        </a>
      </span>
    </div>
  );
};
