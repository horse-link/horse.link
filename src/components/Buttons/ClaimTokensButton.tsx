import React, { useState } from "react";
import { Loader } from "../";

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
    <button
      onClick={click}
      className="w-full h-16 rounded-md border border-gray-500 bg-gray-100 px-5 shadow-md hover:bg-gray-200"
    >
      {loading ? <Loader /> : `Claim ${tokenName}`}
    </button>
  );
};
