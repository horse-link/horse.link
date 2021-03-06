//import { Fragment, useState } from "react";
import { PageLayout } from "../../components";
// import useSWR from "swr";
import { useParams } from "react-router-dom";
import moment from "moment";
// import { Link } from "react-router-dom";

type Props = {};

const horses = [
  {
    id: "1",
    name: "Horse 1",
    Rider: "Rider 1",
    barrier: "8",
    weight: 58,
    win: 4,
    place: 2,
  },
  {
    id: "2",
    name: "Horse 2",
    Rider: "Rider 2",
    barrier: "2",
    weight: 51,
    win: 4.6,
    place: 2,
  },
  {
    id: "3",
    name: "Horse 3",
    Rider: "Rider 3",
    barrier: "1",
    weight: 48,
    win: 8.6,
    place: 4.3,
  },
  {
    id: "4",
    name: "Horse 4",
    Rider: "Rider 4",
    barrier: "3",
    weight: 53,
    win: 3,
    place: 2,
  },
  {
    id: "5",
    name: "Horse 5",
    Rider: "Rider 5",
    barrier: "5",
    weight: 50,
    win: 8,
    place: 5,
  },
  {
    id: "6",
    name: "Horse 6",
    Rider: "Rider 6",
    barrier: "4",
    weight: 52,
    win: 3.6,
    place: 2.5,
  },
  {
    id: "7",
    name: "Horse 7",
    Rider: "Rider 7",
    barrier: "6",
    weight: 58,
    win: 4,
    place: 2.5,
  },
  {
    id: "8",
    name: "Horse 8",
    Rider: "Rider 8",
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
  //const { data, error } = useSWR(`/horseracing/${name}/${id}`);
  return (
    <PageLayout requiresAuth={false}>
      <div className="flex mb-6 p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
        <h1>
          Track: {name}
        </h1>
        <h1>
          Race id: {id}
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
                  { horses.map(horse => (
                    <tr key={horse.id}>
                      <td className="px-1 py-4 whitespace-nowrap bg-gray-200">{horse.id}</td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {horse.name} ({horse.barrier})
                        <br />
                        {horse.Rider}
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
