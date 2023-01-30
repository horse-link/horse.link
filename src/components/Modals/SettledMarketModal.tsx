import React from "react";
import { BaseModal } from ".";
import utils from "../../utils";
import constants from "../../constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  hashes?: string[];
};

export const SettledMarketModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hashes
}) => (
  <BaseModal isOpen={isOpen} onClose={onClose}>
    <div className="max-w-[95vw] lg:min-w-[28rem]">
      <h2 className="font-bold text-2xl">Settled Race</h2>
      <h3 className="mt-4 font-semibold">Transactions:</h3>
      <ol className="ml-4 list-decimal">
        {hashes?.map(hash => (
          <li key={hash}>
            <a
              href={`${constants.env.SCANNER_URL}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hyperlink"
            >
              {utils.formatting.shortenHash(hash)}
            </a>
          </li>
        ))}
      </ol>
    </div>
  </BaseModal>
);
