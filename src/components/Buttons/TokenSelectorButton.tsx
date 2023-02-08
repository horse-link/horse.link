import React from "react";
import { useTokenContext } from "../../providers/Token";

export const TokenSelectorButton: React.FC = () => {
  const { currentToken } = useTokenContext();

  return <div>{currentToken?.symbol}</div>;
};
