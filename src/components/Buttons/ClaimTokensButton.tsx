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
    className="h-16 rounded-md border border-gray-500 bg-gray-100 px-5 shadow-md hover:bg-gray-200"
  >
    {isLoading ? <Loader /> : `Claim ${tokenName}`}
  </button>
);
