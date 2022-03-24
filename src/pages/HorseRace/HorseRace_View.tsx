//import { Fragment, useState } from "react";
import { PageLayout } from "../../components";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom";

type Props = {};

const horses = [
  {
    id: "1",
    name: "Horse 1",
    jocky: "Jocky 1",
    barrier: "8",
    weight: 58,
    win: 4,
    place: 2,
  },
  {
    id: "2",
    name: "Horse 2",
    jocky: "Jocky 2",
    barrier: "2",
    weight: 51,
    win: 4.6,
    place: 2,
  },
  {
    id: "3",
    name: "Horse 3",
    jocky: "Jocky 3",
    barrier: "1",
    weight: 48,
    win: 8.6,
    place: 4.3,
  },
  {
    id: "4",
    name: "Horse 4",
    jocky: "Jocky 4",
    barrier: "3",
    weight: 53,
    win: 3,
    place: 2,
  },
  {
    id: "5",
    name: "Horse 5",
    jocky: "Jocky 5",
    barrier: "5",
    weight: 50,
    win: 8,
    place: 5,
  },
  {
    id: "6",
    name: "Horse 6",
    jocky: "Jocky 6",
    barrier: "4",
    weight: 52,
    win: 3.6,
    place: 2.5,
  },
  {
    id: "7",
    name: "Horse 7",
    jocky: "Jocky 7",
    barrier: "6",
    weight: 58,
    win: 4,
    place: 2.5,
  },
  {
    id: "8",
    name: "Horse 8",
    jocky: "Jocky 8",
    barrier: "7",
    weight: 45,
    win: 3.5,
    place: 1.75,
  }
];

const HorseRaceView: React.FC<Props> = () => {
  const { name, id } = useParams();
  // TODO: Add check to see if race is complete
  // If race is complete show race results data instead
  //const { data, error } = useSWR(`/horseracing/${mnemonic}/${id}`);
  return (
    <PageLayout requiresAuth={false}>
      <div className="mb-6">
      Track: {name}
      <br />
      Race id: {id}
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
                  { horses.map(horse => (
                    <tr key={horse.id}>
                      <td className="px-1 py-4 whitespace-nowrap bg-gray-200">{horse.id}</td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {horse.name} ({horse.barrier})
                        <br />
                        {horse.jocky}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">{horse.weight}</td>
                      <td className="px-2 py-4 whitespace-nowrap">{horse.win}</td>
                      <td className="px-2 py-4 whitespace-nowrap">{horse.place}</td>
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
