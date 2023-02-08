import React from "react";
import { useTokenContext } from "../../providers/Token";
import ClipLoader from "react-spinners/ClipLoader";
import { BaseButton } from "./BaseButton";

export const TokenSelectorButton: React.FC = () => {
  const { currentToken, tokensLoading, openModal } = useTokenContext();

  return (
    <div>
      {tokensLoading || !currentToken ? (
        <ClipLoader size={20} />
      ) : (
        <BaseButton
          onClick={openModal}
          className="mb-4 !px-32 text-sm lg:mb-0 lg:!px-8"
        >
          {currentToken.symbol}
        </BaseButton>
      )}
    </div>
  );
};
