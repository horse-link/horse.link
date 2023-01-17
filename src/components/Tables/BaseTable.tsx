import React from "react";
import { TableHeader, TableRow } from "../../types/table";

type Props = {
  headers: TableHeader[];
  rows: TableRow[];
  title?: string;
  tableStyles?: string;
};

export const BaseTable: React.FC<Props> = props => {
  const { headers, rows, tableStyles, title } = props;

  const headerStyles =
    "px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase";
  const cellStyles = "px-2 py-4 whitespace-nowrap";

  const createHeaderKey = (i: number) => `header-${i}`;
  const createRowKey = (i: number) => `row-${i}`;
  const createDataKey = (i: number) => `data-${i}`;

  return (
    <div className={`flex flex-col ${tableStyles || ""}`}>
      {title && (
        <h3 className="text-lg mb-3 font-medium text-gray-900">{title}</h3>
      )}
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, i) => (
                    <th
                      key={createHeaderKey(i)}
                      scope="col"
                      className={`${headerStyles} ${header.classNames || ""}`}
                    >
                      {header.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map(({ data, row }, i) => (
                  <tr
                    key={createRowKey(i)}
                    className={row?.classNames || ""}
                    {...row?.props}
                  >
                    {data.map((d, i) => (
                      <td
                        key={createDataKey(i)}
                        className={`${cellStyles} ${d.classNames || ""}`}
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
        </div>
      </div>
    </div>
  );
};
