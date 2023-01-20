import React from "react";
import utils from "../../utils";
import constants from "../../constants";

type Props = {
  hash: string;
  message: string;
};

export const Web3SuccessHandler: React.FC<Props> = ({ hash, message }) => (
  <div className="py-4 rounded-md flex flex-col">
    <h2 className="font-bold text-2xl mr-[8vw] mb-2">Transaction result</h2>
    <span className="block lg:hidden">
      {`${message}: `}
      <a
        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        href={`${constants.env.SCANNER_URL}/tx/${hash}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        {utils.formatting.shortenAddress(hash)}
      </a>
    </span>
    <span className="hidden lg:block">
      {`${message}: `}
      <br />
      <a
        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        href={`${constants.env.SCANNER_URL}/tx/${hash}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        {hash}
      </a>
    </span>
  </div>
);
