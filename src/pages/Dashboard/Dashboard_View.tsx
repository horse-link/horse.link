import { Loader, PageLayout } from "../../components";
import { Meet } from "../../types/index";
import { Link } from "react-router-dom";
import moment from "moment";
import Skeleton from "react-loading-skeleton";

type Props = {
  asLocaltime: (raceTime: number) => string;
  meets: Meet[];
  inPlay: string | undefined;
  numberOfBets: number;
  signature: string;
  owner: string;
};

type TableProps = {
  asLocaltime: (raceTime: number) => string;
  meets: Meet[];
};

const DashboardView: React.FC<Props> = (props: Props) => {
  const { asLocaltime, meets, inPlay, numberOfBets, owner, signature } = props;

  const stats = [
    { name: "Total Liquidity", stat: `$ ${numberOfBets}` },
    {
      name: "In Play",
      stat: inPlay === "" ? <Loader /> : `$ ${inPlay}`
    },
    { name: "Performance", stat: "0.0%" }
  ];

  return (
    <PageLayout requiresAuth={false}>
      <div className="grid gap-6">
        <div>
          <div className="container-fluid px-4 py-5 bg-green-700 shadow rounded-lg overflow-hidden sm:p-6">
            <div className="flex flex-wrap justify-between">
              <img
                loading="lazy"
                alt="Horse-Link"
                src="/images/horse-link.png"
                className="mt-2 mb-8"
              />
              <img
                loading="lazy"
                alt="Horse"
                src="/images/horse.png"
                className="h-20"
              />
            </div>
            <h2 className="text-lg mb-3 font-medium text-gray-900">
              Exchange on sports markets with deep liquidity
            </h2>
            <p className="text-xs my-2">
              Aenean in dictum massa. Integer posuere erat lorem, in commodo
              eros fringilla non. Donec ullamcorper porta tortor a dapibus.
              Maecenas volutpat augue quis tortor commodo eleifend. Mauris
              fermentum imperdiet diam sed sodales.
            </p>
          </div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map(item => (
              <div
                key={item.name}
                className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
              >
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <Table asLocaltime={asLocaltime} meets={meets} />
        <div className="flex justify-center px-4 py-5 bg-white shadow rounded-lg sm:p-6">
          <div className="w-4/5 max-w-2xl">
            <div className="flex flex-col items-center">
              <h2 className="text-lg">Signature :</h2>
              <h2 className="break-all">
                {signature || <Skeleton width={"25em"} count={2} />}
              </h2>
            </div>
            <div className="mt-3 flex flex-col items-center">
              <h2 className="text-lg">Owner Address :</h2>
              <h2 className="break-all">
                {owner || <Skeleton width={"25em"} />}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const Table: React.FC<TableProps> = (props: TableProps) => {
  const { meets } = props;

  return (
    <div className="grid grid-cols-2">
      <div className="col-span-2">
        <h3 className="text-lg mb-3 font-medium text-gray-900">Todays Meets</h3>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
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
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 1
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 2
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 3
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 4
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 5
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 6
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 7
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 8
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 9
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Race 10
                      </th>
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
                          <td className="px-3 py-4 whitespace-nowrap text-sm hover:bg-gray-200">
                            {race.name ? (
                              <>
                                <Link to={`/horses/${meet.id}/${race.number}`}>
                                  <p>R{race.number}</p>
                                </Link>
                                <Link to={`/horses/${meet.id}/${race.number}`}>
                                  <br></br>
                                  {moment
                                    .utc(race.start)
                                    .local()
                                    .format("H:mm")}
                                </Link>
                              </>
                            ) : (
                              <Skeleton count={2} />
                            )}
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

export default DashboardView;
