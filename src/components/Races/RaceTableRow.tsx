import React from "react";
import Skeleton from "react-loading-skeleton";
import { Runner } from "../../types/meets";
import utils from "../../utils";

type Props = {
  runner?: Runner;
  onClick: (runner?: Runner) => void;
};

export const RaceTableRow: React.FC<Props> = ({ runner, onClick }) => {
  const { number, name, barrier, odds } = runner || {};

  return (
    <tr
      className="cursor-pointer hover:bg-gray-100"
      onClick={() => onClick(runner)}
    >
      <td className="px-1 py-4 whitespace-nowrap bg-gray-200">
        {number ?? <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {name ? `${name} (${barrier ?? "?"})` : <Skeleton width="10em" />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {name ? "?" : <Skeleton width="2em" />}
      </td>

      <td className="px-2 py-4 whitespace-nowrap">
        {odds ? (
          utils.formatting.formatToTwoDecimals(odds.toString())
        ) : (
          <Skeleton width="2em" />
        )}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {name ? "?" : <Skeleton width="2em" />}
      </td>
    </tr>
  );
};
