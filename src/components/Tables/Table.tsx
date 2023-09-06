import React from "react";
import classNames from "classnames";

// [ [nodes...], [nodes...] ]
type Props = {
  headers: Array<React.ReactNode>;
  headerStyles?: string;
  rows: Array<Array<React.ReactNode>>;
  rowStyles?: string;
};

export const Table: React.FC<Props> = ({
  headers,
  headerStyles,
  rows,
  rowStyles
}) => (
  <table className="block w-full border border-hl-border">
    <thead className="flex justify-evenly bg-hl-background-secondary px-4">
      {headers.map((h, i) => (
        <th
          className={classNames("block w-full", {
            [headerStyles!]: !!headerStyles
          })}
          key={`table-header-${i}`}
        >
          {h}
        </th>
      ))}
    </thead>
    <tbody className="flex flex-col divide-y divide-hl-border px-4">
      {rows.map((row, i) => (
        <tr
          className={classNames("flex w-full justify-evenly", {
            [rowStyles!]: !!rowStyles
          })}
          key={`table-rows-${i}`}
        >
          {row.map((r, i) => (
            <td
              className={classNames("block w-full")}
              key={`table-row-data-${i}`}
            >
              {r}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
