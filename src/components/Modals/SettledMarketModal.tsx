import React from "react";
import { BaseModal } from ".";
import utils from "../../utils";
import { useScannerUrl } from "../../hooks/useScannerUrl";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  hashes?: Array<string>;
};

export const SettledMarketModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hashes
}) => {
  const scanner = useScannerUrl();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="font-basement text-[32px] tracking-wider">
          SETTLED RACE
        </h2>
        <div className="mt-8 flex flex-col items-center">
          {hashes?.map(hash => (
            <p key={hash}>
              <a
                href={`${scanner}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {utils.formatting.shortenHash(hash)}
              </a>
            </p>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};
