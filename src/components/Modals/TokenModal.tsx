import React from "react";
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

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {tokensLoading || !availableTokens || !availableTokens.length ? (
        <div className="p-10">
          <Loader />
        </div>
      ) : (
        <div className="max-w-[95vw] lg:min-w-[28rem]">
          <h2 className="text-xl font-bold">Available Tokens</h2>
          <div className="mt-4 w-full">
            {availableTokens.map(t => (
              <div className="w-full">
                <button
                  className="w-full rounded-md py-1 hover:bg-zinc-100"
                  onClick={() => {
                    changeToken(t);
                    onClose();
                  }}
                >
                  {t.symbol}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </BaseModal>
  );
};
