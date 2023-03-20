import React from "react";
import { useBetSlipContext } from "../../providers/BetSlip";
import { BaseModal } from "./BaseModal";
import { Loader } from "../Loader";
import utils from "../../utils";
import { useScannerUrl } from "../../hooks/useScannerUrl";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const BetSlipTxModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { hashes, errors } = useBetSlipContext();
  const scanner = useScannerUrl();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {!hashes?.length ? (
        !errors?.length ? (
          <React.Fragment>
            <h2 className="text-2xl font-bold">Transaction Loading</h2>
            <div className="mt-4 flex w-full justify-center">
              <Loader />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h2 className="text-2xl font-bold">Bet Slip Errors</h2>
            {errors.length === 1 ? (
              <div className="mt-6 w-full rounded-md bg-red-600 py-4 text-center text-white">
                {utils.errors.getMeaningfulMessage(errors[0])}
              </div>
            ) : (
              <React.Fragment>
                <h3 className="mt-2">
                  Placing your bets returned the following errors:
                </h3>
                <ol className="ml-4 mt-2 list-decimal">
                  {errors.map((err, i) => (
                    <li key={`${err}-${i}`}>
                      A bet rejected with reason:{" "}
                      {utils.errors.getMeaningfulMessage(err)}
                    </li>
                  ))}
                </ol>
              </React.Fragment>
            )}
          </React.Fragment>
        )
      ) : (
        <React.Fragment>
          <h2 className="text-2xl font-bold">Bet Slip Transactions</h2>
          <ol className="ml-4 mt-6 list-decimal">
            {hashes.map(hash => (
              <li key={hash}>
                <a
                  href={`${scanner}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hyperlink underline underline-offset-2"
                >
                  {utils.formatting.shortenHash(hash)}
                </a>
              </li>
            ))}
          </ol>
          {!!errors?.length && (
            <div className="mt-4">
              <h3 className="font-bold">
                One or more bets produced the following errors:
              </h3>
              <ol className="ml-4 mt-2 list-decimal">
                {errors.map((err, i) => (
                  <li key={`${err}-${i}`}>
                    A bet rejected with reason:{" "}
                    {utils.errors.getMeaningfulMessage(err)}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </React.Fragment>
      )}
    </BaseModal>
  );
};
