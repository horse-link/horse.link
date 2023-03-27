import React from "react";
import { TableHeader, TableRow } from "../../types/table";
import classNames from "classnames";

type Props = {
  headers: TableHeader[];
  rows: TableRow[];
  title?: string;
  tableStyles?: string;
  leftColumnSticky?: boolean;
};

export const BaseTable: React.FC<Props> = props => {
  const { headers, rows, tableStyles, title, leftColumnSticky } = props;

  const headerStyles =
    "px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap z-10";
  const cellStyles = "px-2 py-4 whitespace-nowrap z-10";

  const createHeaderKey = (i: number) => `header-${i}`;
  const createRowKey = (i: number) => `row-${i}`;
  const createDataKey = (i: number) => `data-${i}`;

  return (
    <div
      className={classNames("flex w-full flex-col overflow-x-hidden", {
        [tableStyles!]: !!tableStyles
      })}
    >
      {title && (
        <h3 className="mb-3 w-full text-lg font-medium text-gray-900">
          {title}
        </h3>
      )}
      <table className="block w-full divide-y divide-gray-200 overflow-x-scroll lg:table">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, i, a) => (
              <th
                key={createHeaderKey(i)}
                scope="col"
                className={classNames(headerStyles, {
                  [header.classNames!]: !!header.classNames,
                  "lg:rounded-tl-lg": i === 0,
                  "lg:rounded-tr-lg": i === a.length - 1,
                  "sticky left-0 right-0 top-0 bottom-0 !z-50":
                    !!leftColumnSticky && i === 0
                })}
              >
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {rows.map(({ data, row }, rowIndex, rowArray) => (
            <tr
              key={createRowKey(rowIndex)}
              className={classNames({
                [row?.classNames!]: !!row?.classNames
              })}
              role="row"
              {...row?.props}
            >
              {data.map((d, i, a) => (
                <td
                  key={createDataKey(i)}
                  className={classNames(cellStyles, {
                    [d.classNames!]: !!d.classNames,
                    "lg:rounded-bl-lg":
                      i === 0 && rowIndex === rowArray.length - 1,
                    "lg:rounded-br-lg":
                      i === a.length - 1 && rowIndex === rowArray.length - 1,
                    "sticky left-0 right-0 top-0 bottom-0 !z-50":
                      !!leftColumnSticky && i === 0
                  })}
                  role="cell"
                  {...d.props}
                >
                  {d.title}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
