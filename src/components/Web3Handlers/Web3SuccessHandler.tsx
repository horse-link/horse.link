import React from "react";
import utils from "../../utils";
import constants from "../../constants";

type Props = {
  hash: string;
  message: string;
};

export const Web3SuccessHandler: React.FC<Props> = ({ hash, message }) => (
  <div className="flex flex-col rounded-md py-4">
    <h2 className="mr-[8vw] mb-2 text-2xl font-bold">
      Transaction Confirmation
    </h2>
    <span className="block lg:hidden">
      {`${message}: `}
      <a
        className="hyperlink underline"
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
        className="hyperlink underline"
        href={`${constants.env.SCANNER_URL}/tx/${hash}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        {hash}
      </a>
    </span>
  </div>
);
