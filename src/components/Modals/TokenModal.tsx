import React, { useCallback } from "react";
import { Token } from "../../types/tokens";
import { BaseModal } from "./BaseModal";
import { Loader } from "../Loader";
import { useTokenContext } from "../../providers/Token";
import utils from "../../utils";

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
        <div className="p-10">
          <Loader />
        </div>
      ) : (
        <div className="w-[95vw] max-w-full lg:max-w-[28rem]">
          <h2 className="text-xl font-bold">Available Tokens</h2>
          <div className="mt-4 w-full">
            {availableTokens.map(t => (
              <div className="w-full" key={t.address}>
                <button
                  className="flex w-full justify-between rounded-md py-1 px-2 hover:bg-zinc-100"
                  onClick={() => onClick(t)}
                >
                  <span className="block">{t.symbol}</span>
                  <span className="block">
                    {utils.formatting.shortenAddress(t.address)}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </BaseModal>
  );
};
