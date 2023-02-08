import React from "react";
import { TokenSelectorButton } from "../Buttons";

export const TokenSelector: React.FC = () => {
  return (
    <div className="flex h-full items-center text-black">
      <TokenSelectorButton />
    </div>
  );
};
