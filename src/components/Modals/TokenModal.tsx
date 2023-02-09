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
        <div className="p-10">
          <Loader />
        </div>
      ) : (
        <div className="w-[95vw] max-w-full lg:max-w-[28rem]">
          <h2 className="text-xl font-bold">Select a Token</h2>
          <div className="mt-4 w-full">
            {availableTokens.map(t => (
              <div className="w-full" key={t.address}>
                <button
                  className="flex items-center w-full rounded-md py-1 px-2 hover:bg-zinc-100"
                  onClick={() => onClick(t)}
                >
                  <img
                    src={t.src}
                    alt={`${t.symbol} icon`}
                    className="h-[2rem] mr-4"
                  />
                  <div className="flex flex-col justify-start items-start pt-2">
                    <h5 className="font-semibold text-lg">{t?.name}</h5>
                    <h6 className="text-black/50 relative bottom-2">
                      {t.symbol}
                    </h6>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </BaseModal>
  );
};
