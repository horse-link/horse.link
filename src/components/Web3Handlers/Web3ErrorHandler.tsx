import React, { useMemo } from "react";
import utils from "../../utils";

type Props = {
  error: any;
};

export const Web3ErrorHandler: React.FC<Props> = ({ error }) => {
  const message = useMemo(() => {
    console.error(error);

    return utils.errors.getMeaningfulMessage(error);
  }, [error]);

  return (
    <div className="mt-6 flex flex-col items-center rounded-md bg-red-600 px-2 py-4">
      <h4 className="mb-1 text-lg font-semibold">Error:</h4>
      <span className="block max-w-[40ch] overflow-hidden overflow-ellipsis">
        {message}
      </span>
    </div>
  );
};
