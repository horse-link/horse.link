import { Loader, PageLayout } from "../../components";
import { Meet } from "../../types/index";
import { Link } from "react-router-dom";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { FormattedProtocol } from "../../types/entities";
import { ethers } from "ethers";
import { formatToTwoDecimals } from "../../utils/formatting";

type Props = {
  asLocaltime: (raceTime: number) => string;
  meets: Meet[];
  signature: string | undefined;
  owner: string | undefined;
  stats: FormattedProtocol | undefined;
};

type TableProps = {
  asLocaltime: (raceTime: number) => string;
  meets: Meet[];
};

const DashboardView: React.FC<Props> = (props: Props) => {
  const { asLocaltime, meets, owner, signature, stats } = props;

  const statsArray = [
    {
      name: "Total Liquidity",
      stat: stats?.tvl ? (
        `$${formatToTwoDecimals(ethers.utils.formatEther(stats.tvl))}`
      ) : (
        <Loader />
      )
    },
    {
      name: "In Play",
      stat: stats?.inPlay ? (
        `$${formatToTwoDecimals(ethers.utils.formatEther(stats.inPlay))}`
      ) : (
        <Loader />
      )
    },
    {
      name: "Performance",
      stat: stats?.performance ? (
        `${formatToTwoDecimals(stats.performance.toString())}%`
      ) : (
        <Loader />
      )
    }
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
              Horse Link is an Ethereum AMM protocol that allows particpants to
              wager on sports markets using ERC20 tokens.
            </h2>
            <p className="text-xs my-2">
              Horse Link&apos;s smart contract guaranteed bets are always placed
              within the slippage band of the constant product function. Like
              other AMM protocols based on curve functions, bets based within
              the range of slippage based on the payout will be placed.
            </p>
          </div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {statsArray.map(stat => (
              <div
                key={stat.name}
                className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
              >
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.stat}
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
        <h3 className="text-lg mb-3 font-medium text-gray-900">
          {moment(Date.now()).format("dddd Do MMMM")}
        </h3>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                          <td>
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
                                      : ""
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

export default DashboardView;
