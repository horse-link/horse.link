import React from "react";
import classNames from "classnames";

// [ [nodes...], [nodes...] ]
type Props = {
  headers: Array<React.ReactNode>;
  headerStyles?: string;
  rows: Array<Array<React.ReactNode>>;
  rowStyles?: string;
};

export const HistorySummaryTable: React.FC<Props> = ({
  headers,
  headerStyles,
  rows,
  rowStyles
}) => (
  <table className="block w-full border border-hl-border">
    <thead className="flex grid grid-cols-12 bg-hl-background-secondary px-4">
      <th
        className={classNames("col-span-4", {
          [headerStyles!]: !!headerStyles
        })}
        key={0}
      >
        {headers[0]}
      </th>
      <th
        className={classNames("col-span-4", {
          [headerStyles!]: !!headerStyles
        })}
        key={1}
      >
        {headers[1]}
      </th>
      <th
        className={classNames("col-span-1", {
          [headerStyles!]: !!headerStyles
        })}
        key={2}
      >
        {headers[2]}
      </th>
      <th
        className={classNames("col-span-2", {
          [headerStyles!]: !!headerStyles
        })}
        key={3}
      >
        {headers[3]}
      </th>
      <th
        className={classNames("col-span-1", {
          [headerStyles!]: !!headerStyles
        })}
        key={4}
      >
        {headers[4]}
      </th>
    </thead>
    <tbody className="flex flex-col divide-y divide-hl-border px-4">
      {rows.map((row, i) => (
        <tr
          className={classNames("flex grid w-full grid-cols-12", {
            [rowStyles!]: !!rowStyles
          })}
          key={`table-rows-${i}`}
        >
          <td className={classNames("col-span-4")} key={`table-row-data-0`}>
            {row[0]}
          </td>
          <td className={classNames("col-span-4")} key={`table-row-data-1`}>
            {row[1]}
          </td>
          <td className={classNames("col-span-1")} key={`table-row-data-2`}>
            {row[2]}
          </td>
          <td className={classNames("col-span-2")} key={`table-row-data-3`}>
            {row[3]}
          </td>
          <td className={classNames("col-span-1")} key={`table-row-data-3`}>
            {row[4]}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
