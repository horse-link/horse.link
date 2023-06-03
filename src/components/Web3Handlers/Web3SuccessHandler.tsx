import React from "react";
import utils from "../../utils";
import { useScannerUrl } from "../../hooks/useScannerUrl";

type Props = {
  hash: string;
  message: string;
};

export const Web3SuccessHandler: React.FC<Props> = ({ hash, message }) => {
  const scanner = useScannerUrl();

  return (
    <div className="flex flex-col rounded-md py-4">
      <h2 className="mb-2 text-[32px] font-bold">Transaction Confirmation</h2>
      <span className="block lg:hidden">
        {`${message}: `}
        <a
          className="hyperlink text-hl-secondary underline"
          href={`${scanner}/tx/${hash}`}
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
          className="hyperlink text-hl-secondary underline"
          href={`${scanner}/tx/${hash}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {hash}
        </a>
      </span>
    </div>
  );
};
