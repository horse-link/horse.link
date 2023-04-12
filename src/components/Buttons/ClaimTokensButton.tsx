import React, { useState } from "react";
import { BaseButton } from "./BaseButton";

type Props = {
  tokenName: string;
  onClick: () => Promise<void>;
};

export const ClaimTokensButton: React.FC<Props> = ({ tokenName, onClick }) => {
  const [loading, setLoading] = useState(false);

  const click = async () => {
    setLoading(true);
    await onClick().catch(console.error);
    setLoading(false);
  };

  return (
    <BaseButton
      title={`Claim ${tokenName}`}
      onClick={click}
      className="mr-4 w-full rounded-md border-2 border-black px-4 py-2 font-bold text-black transition-colors duration-100 enabled:hover:bg-black enabled:hover:text-white lg:w-fit lg:!min-w-[15rem]"
      baseStyleOverride
      loading={loading}
    />
  );
};
