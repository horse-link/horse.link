import React from "react";
import { MeetResults } from "../../types/meets";

type Props = {
  results: MeetResults;
};

export const ResultsTable: React.FC<Props> = ({ results }) => (
  <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-1 py-3 w-10 text-left text-xs font-medium text-gray-500 bg-gray-200 uppercase"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Runner
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Number
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Rider
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map(result => (
                <tr className="cursor-pointer hover:bg-gray-100">
                  <td className="px-1 py-4 whitespace-nowrap bg-gray-200">
                    {result.place}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {result.runner}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {result.number}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {result.rider}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
