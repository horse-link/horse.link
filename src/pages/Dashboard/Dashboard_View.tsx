import { PageLayout } from "../../components";
import { Meet } from "../../types/index";
import { Link } from "react-router-dom";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import Toggle from "../../components/Toggle";
import Card from "../../components/Card";
import MyStats from "./components/MyStats";
import OverallStats from "./components/OverallStats";

type Props = {
  asLocaltime: (raceTime: number) => string;
  meets: Meet[];
  signature: string | undefined;
  owner: string | undefined;
  myPlayEnabled: boolean;
  onMyPlayToggle: () => void;
};
type TableProps = {
  asLocaltime: (raceTime: number) => string;
  meets: Meet[];
};
const DashboardView: React.FC<Props> = (props: Props) => {
  const {
    asLocaltime,
    meets,
    owner,
    signature,
    myPlayEnabled,
    onMyPlayToggle
  } = props;

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
          {myPlayEnabled ? <MyStats /> : <OverallStats />}
        </div>
        <div className="flex gap-3 self-end justify-self-end">
          <Toggle enabled={myPlayEnabled} onChange={onMyPlayToggle} />
          <div>My Stats</div>
        </div>
        <div className="-mt-12">
          <Table asLocaltime={asLocaltime} meets={meets} />
        </div>
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
