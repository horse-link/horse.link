import React from "react";
import { useBetSlipContext } from "../../providers/BetSlip";
import { BaseModal } from "./BaseModal";
import { Loader } from "../Loader";
import constants from "../../constants";
import utils from "../../utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const BetSlipTxModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { hashes, errors } = useBetSlipContext();
  console.log(errors);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {!hashes?.length ? (
        <div className="m-10">
          <Loader />
        </div>
      ) : (
        <div className="w-[75vw] lg:w-[28rem]">
          <h2 className="text-2xl font-bold">Bet Slip Transactions</h2>
          <ol className="ml-4 mt-6 list-decimal">
            {hashes.map(hash => (
              <li key={hash}>
                <a
                  href={`${constants.env.SCANNER_URL}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hyperlink underline underline-offset-2"
                >
                  {utils.formatting.shortenHash(hash)}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </BaseModal>
  );
};
