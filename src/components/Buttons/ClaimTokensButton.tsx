import React from "react";
import { Loader } from "../";

type Props = {
  tokenName: string;
  onClick: () => void;
  isLoading: boolean;
};

export const ClaimTokensButton: React.FC<Props> = ({
  tokenName,
  onClick,
  isLoading
}) => (
  <button
    onClick={onClick}
    className="px-5 h-16 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-500 shadow-md "
  >
    {isLoading ? <Loader /> : `Claim ${tokenName}`}
  </button>
);
