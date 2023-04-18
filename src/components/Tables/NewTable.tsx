import React from "react";

// [ [nodes...], [nodes...] ]
type Props = {
  headers: Array<React.ReactNode>;
  rows: Array<Array<React.ReactNode>>;
};

export const NewTable: React.FC<Props> = ({ headers, rows }) => (
  <table className="block w-full border border-hl-border">
    <thead className="flex justify-evenly bg-hl-background-secondary px-4">
      {headers.map(h => (
        <th className="block w-full">{h}</th>
      ))}
    </thead>
    <tbody className="flex flex-col divide-y divide-hl-border px-4">
      {rows.map(row => (
        <tr className="flex w-full justify-evenly">
          {row.map(r => (
            <td className="block w-full">{r}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
