import { Runner } from "../../types/meets";
import { RaceTableRow } from ".";

type Props = {
  runners: Runner[] | undefined[];
  onClickRunner: (runner?: Runner) => void;
};

export const RaceTable: React.FC<Props> = ({ runners, onClickRunner }) => (
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
              {runners.map(runner => (
                <RaceTableRow runner={runner} onClick={onClickRunner} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
