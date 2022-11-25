import React from 'react'
import { shortenAddress } from '../../utils/formatting';

type Props = {
  hash: string;
};

const Web3SuccessHandler: React.FC<Props> = ({ hash }) => {
  return (
    <div className="mt-6 px-2 py-4 bg-emerald-400 rounded-md flex flex-col items-center">
      <h4 className="font-semibold mb-1 text-lg">Success!</h4>
      <span className="block">
        Hash:{" "}
        <a
          className="italic"
          href={`${process.env.VITE_SCANNER_URL}/tx/${hash}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {shortenAddress(hash)}
        </a>
      </span>
    </div>
  );
};

export default Web3SuccessHandler;
