import React from "react";
import { Meet } from "../../types/meets";
import { Link } from "react-router-dom";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import utils from "../../utils";
import classNames from "classnames";

const LOADING_LENGTH = 15;

type Props = {
  meets?: Meet[];
};

export const DashboardTable: React.FC<Props> = ({ meets }) => {
  const maxLength = meets
    ? Math.max(...meets.map(meet => meet.races.length))
    : LOADING_LENGTH;

  return (
    <div className="grid grid-cols-2">
      <div className="col-span-2">
        <h3 className="text-lg mb-3 font-medium text-gray-900">
          {moment(Date.now()).format("dddd Do MMMM")}
        </h3>
        <div className="flex flex-col overflow-x-scroll">
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
                      {Array.from({ length: maxLength }, (_, i) => (
                        <th
                          key={`header${i}`}
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Race {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {meets
                      ? meets.map((meet, i) => (
                          <tr key={`meet${i}`}>
                            <td className="px-3 py-4 whitespace-nowrap">
                              {meet.name} ({meet.location})
                            </td>
                            {meet.races.map((race, i) => {
                              const isAfterClosingTime = moment().isAfter(
                                moment(race.close)
                              );
                              return (
                                <td key={`race${i}`}>
                                  <Link
                                    className={classNames({
                                      "!cursor-default":
                                        race.status === "Interim" ||
                                        race.status === "Abandoned" ||
                                        race.status === "Closed" ||
                                        (race.status === "Normal" &&
                                          isAfterClosingTime)
                                    })}
                                    to={
                                      race.status === "Normal" &&
                                      !isAfterClosingTime
                                        ? `/horses/${meet.id}/${race.number}`
                                        : race.status === "Paying"
                                        ? `/results/${utils.markets.getPropositionIdFromRaceMeet(
                                            race,
                                            meet
                                          )}`
                                        : // race status in any other condition other than normal or paying
                                          ""
                                    }
                                  >
                                    <div
                                      className={classNames(
                                        "px-3 py-4 whitespace-nowrap text-sm",
                                        {
                                          "bg-gray-400 hover:bg-gray-500":
                                            race.status === "Paying",
                                          "bg-black text-white":
                                            race.status === "Abandoned",
                                          "bg-emerald-400":
                                            race.status === "Interim",
                                          "hover:bg-gray-200":
                                            race.status === "Normal"
                                        }
                                      )}
                                    >
                                      <p>R{race.number}</p>
                                      {moment
                                        .utc(race.start)
                                        .local()
                                        .format("H:mm")}
                                      <p>
                                        {race.status == "Paying"
                                          ? race.results?.join(" ")
                                          : race.status == "Abandoned"
                                          ? "ABND"
                                          : isAfterClosingTime
                                          ? "CLSD"
                                          : moment(race.close).fromNow(true)}
                                      </p>
                                    </div>
                                  </Link>
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      : utils.mocks
                          .getMockRaces(LOADING_LENGTH)
                          .map((_, i, array) => (
                            <tr key={`mock${i}`}>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <Skeleton />
                              </td>
                              {array.map((_, i) => (
                                <td key={`skeleton${i}`}>
                                  <Skeleton count={2} />
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
