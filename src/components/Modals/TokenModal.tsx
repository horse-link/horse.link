import React, { useCallback } from "react";
import { Token } from "../../types/tokens";
import { BaseModal } from "./BaseModal";
import { Loader } from "../Loader";
import { useTokenContext } from "../../providers/Token";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  availableTokens?: Array<Token>;
  tokensLoading: boolean;
};

export const TokenModal: React.FC<Props> = ({
  isOpen,
  onClose,
  availableTokens,
  tokensLoading
}) => {
  const { changeToken } = useTokenContext();

  const onClick = useCallback(
    (t: Token) => {
      changeToken(t);
      onClose();
    },
    [changeToken, onClose]
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {tokensLoading || !availableTokens || !availableTokens.length ? (
        <div className="flex w-full flex-col items-center p-10">
          <Loader />
        </div>
      ) : (
        <React.Fragment>
          <h2 className="text-xl font-bold">Select a Token</h2>
          <div className="mt-4 w-full">
            {availableTokens.map(t => (
              <div className="w-full" key={t.address}>
                <button
                  className="flex w-full items-center rounded-md py-1 px-2 hover:bg-hl-primary hover:text-hl-secondary"
                  onClick={() => onClick(t)}
                >
                  <img
                    src={t.src}
                    alt={`${t.symbol} icon`}
                    className="mr-4 h-[2rem]"
                  />
                  <div className="flex flex-col items-start justify-start pt-2">
                    <h5 className="text-lg font-semibold">{t?.name}</h5>
                    <h6 className="relative bottom-2 text-hl-tertiary">
                      {t.symbol}
                    </h6>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </BaseModal>
  );
};
