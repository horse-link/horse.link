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
    try {
      await onClick();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseButton
      title={`Claim ${tokenName}`}
      onClick={click}
      className="mr-4 rounded-md border-2 border-black px-4 py-2 font-bold text-black transition-colors duration-100 enabled:hover:bg-black enabled:hover:text-white"
      baseStyleOverride
      loading={loading}
    />
  );
};
