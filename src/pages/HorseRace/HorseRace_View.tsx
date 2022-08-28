//import { Fragment, useState } from "react";
import { PageLayout } from "../../components";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Runners } from "../../types";

type Props = {
  runners: Runners[]
  // asLocaltime: (raceTime: number) => string;
  // meets: Meet[];
  // inPlay: string | undefined;
  // numberOfBets: number;
  // connected: boolean;
  // // hash: string;
  // signature: string;
  // owner: string;
};

const HorseRaceView: React.FC<Props> = (props: Props) => {

  const { runners } = props;
  const { track, number } = useParams();

  return (
    <PageLayout requiresAuth={false}>
      <div className="flex mb-6 p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
        <h1>
          Track: {track}
        </h1>
        <h1>
          Race #: {number}
        </h1>
        <h1>
          Date: {moment().format("DD-MM-YY")}
        </h1>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-1 py-3 text-left text-xs font-medium text-gray-500 bg-gray-200 uppercase"
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
                    <tr key={runner.number}>
                      <td className="px-1 py-4 whitespace-nowrap bg-gray-200">{runner.number}</td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {runner.name} ({runner.barrier})
                        <br />
                        {/* {horse.Rider} */}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">NA</td>
                      <td className="px-2 py-4 whitespace-nowrap">{runner.odds / 1000}</td>
                      <td className="px-2 py-4 whitespace-nowrap">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HorseRaceView;
