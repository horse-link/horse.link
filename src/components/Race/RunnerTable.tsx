import Skeleton from "react-loading-skeleton";
import { Runner } from "../../types/meets";
import utils from "../../utils";

type Props = {
  runners: Runner[] | undefined[];
  onClickRunner: (runner?: Runner) => void;
};

const RunnerTable: React.FC<Props> = ({ runners, onClickRunner }) => {
  return (
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
                    Runner (Barrier)
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Weight
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Win
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Place
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {runners.map((runner, i) => {
                  const { number, name, barrier, odds } = runner || {};
                  return (
                    <tr
                      className="cursor-pointer hover:bg-gray-100"
                      key={i}
                      onClick={() => onClickRunner(runner)}
                    >
                      <td className="px-1 py-4 whitespace-nowrap bg-gray-200">
                        {number ?? <Skeleton />}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {name ? (
                          `${name} (${barrier ?? "?"})`
                        ) : (
                          <Skeleton width="10em" />
                        )}
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerTable;
