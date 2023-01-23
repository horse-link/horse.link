import React from "react";
import utils from "../../utils";
import constants from "../../constants";
import { BaseModal } from "./BaseModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  hashes?: string[];
};

export const BetSlipSuccessModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hashes
}) => (
  <BaseModal isOpen={isOpen} onClose={onClose}>
    <div className="max-w-[95vw] lg:min-w-[28rem]">
      <h2 className="font-bold text-2xl">Bet Slip Placed</h2>
      <h3 className="mt-4 font-semibold">Transactions:</h3>
      <ol className="ml-4 list-decimal">
        {hashes?.map(hash => (
          <li key={hash}>
            <a
              href={`${constants.env.SCANNER_URL}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >
              {utils.formatting.shortenHash(hash)}
            </a>
          </li>
        ))}
      </ol>
    </div>
  </BaseModal>
);
