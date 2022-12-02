import React from "react";
import { Meet } from "../../types/meets";
import { Link } from "react-router-dom";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import utils from "../../utils";

type Props = {
  meets: Meet[];
};

export const DashboardTable: React.FC<Props> = ({ meets }) => {
  const maxLength = Math.max(...meets.map(meet => meet.races.length));

  return (
    <div className="grid grid-cols-2">
      <div className="col-span-2">
        <h3 className="text-lg mb-3 font-medium text-gray-900">
          {moment(Date.now()).format("dddd Do MMMM")}
        </h3>
        <div className="flex flex-col">
          <div>
            <div className="py-2 align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Venue
                      </th>
                      {[...new Array(maxLength)].map((_, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Race {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {meets.map(meet => (
                      <tr key={meet.id}>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {meet.name ? (
                            `${meet.name} (${meet.location})`
                          ) : (
                            <Skeleton />
                          )}
                        </td>
                        {meet.races.map(race => (
                          <td key={race.number}>
                            <div
                              className={`px-3 py-4 whitespace-nowrap text-sm
                                ${
                                  race.status == "Paying"
                                    ? "bg-gray-400 hover:bg-gray-500"
                                    : "hover:bg-gray-200"
                                }`}
                            >
                              {race.name ? (
                                <Link
                                  to={
                                    race.status !== "Paying"
                                      ? `/horses/${meet.id}/${race.number}`
                                      : `/results/${utils.markets.getPropositionIdFromRaceMeet(
                                          race,
                                          meet
                                        )}`
                                  }
                                >
                                  <p>R{race.number}</p>
                                  {moment
                                    .utc(race.start)
                                    .local()
                                    .format("H:mm")}
                                  <p>
                                    {race.status == "Paying"
                                      ? race.results?.join(" ")
                                      : moment(race.close).fromNow(true)}
                                  </p>
                                </Link>
                              ) : (
                                <Skeleton count={2} />
                              )}
                            </div>
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
      </div>
    </div>
  );
};
