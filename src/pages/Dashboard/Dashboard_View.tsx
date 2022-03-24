//import { Fragment, useState } from "react";
import { PageLayout } from "../../components";
import moment from "moment";
import { Link } from "react-router-dom";

type Props = {};

const DashboardView: React.FC<Props> = () => {
  const stats = [
    { name: "Total Liquidity", stat: "$71,897.87" },
    { name: "Total Winnings", stat: "$21,829.16" },
    { name: "Liquidity to Winnings Ratio", stat: "329.36%" }
  ];
  return (
    <PageLayout requiresAuth={false}>
      <div className="mb-6">
      <div className="container-fluid px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
        <h1 className="mb-3 text-2xl">
          Horse Link
        </h1>
        {/*<img loading="lazy" alt="Horse:Link" src="../../../public/images/horse-link.png" />*/}
        <p className="text-xs my-2">
          Horse Link is a privacy focused crypto sports betting site. We do not
          capture any personal infomation and only ask our punters to supply
          a payout address. We do not hold any of our customers funds and
          payout immediately once bets have been confirmed on the
          blockchain.
        </p>
        <p className="text-xs my-2">
          We encourage all our punters to use PGP encrypted mail should you
          need to contact us. Our PGP public key can be found at MIT or protonmail.
        </p>
        <p className="text-xs my-2">
          In order to use the site, you must add a payout address which is stored in your browsers local storage.
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
      <div className="grid grid-cols-2 gap-4 items-start lg:gap-8">
        <Table />
      </div>
    </PageLayout>
  );
};

const Table: React.FC = () => {
  const meets = [
    {
      name: "Ipswich",
      location: "QLD",
      races: [
        {
          time: moment().valueOf(),
          index: 1,
        },
        {
          time: moment().add(2, "h").valueOf(),
          index: 2,
        },
        {
          time: moment().add(4, "h").valueOf(),
          index: 3,
        },
        {
          time: moment().add(5, "h").valueOf(),
          index: 4,
        }
      ],
      mnemonic: ""
    },
    {
      name: "Hawkesbury",
      location: "NSW",
      races: [
        {
          time: moment().valueOf(),
          index: 1,
        },
        {
          time: moment().add(2, "h").valueOf(),
          index: 2,
        },
        {
          time: moment().add(4, "h").valueOf(),
          index: 3,
        }
      ],
      mnemonic: ""
    },
    {
      name: "Pakenham",
      location: "VIC",
      races: [
        {
          time: moment().valueOf(),
          index: 1,
        },
        {
          time: moment().add(2, "h").valueOf(),
          index: 2,
        },
        {
          time: moment().add(4, "h").valueOf(),
          index: 3,
        },
        {
          time: moment().add(6, "h").valueOf(),
          index: 4,
        },
        {
          time: moment().add(8, "h").valueOf(),
          index: 5,
        }
      ],
      mnemonic: ""
    },
  ];

  const asLocaltime = (raceTime: number) => {
    
    const _time = moment.utc(raceTime).diff(moment(), "h");

    if (Date.now() / 1000 > moment.utc(raceTime).unix()) {
      return "Completed";
    }

    return _time.toString();
  }

  return (
    <div className="col-span-2">
      <h3 className="text-lg mb-3 font-medium text-gray-900">Meets</h3>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Race Course
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  { meets.map(meet => (
                    <tr key={meet.location}>
                      <td className="px-3 py-4 whitespace-nowrap">{meet.name} ({meet.location})</td>
                      
                      { meet.races.map(race => (
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <Link to={{ pathname: `/horses/${meet.mnemonic}/${race.index}` }}>R{race.index}</Link>
                          <br></br>
                          {
                            `${asLocaltime(race.time)} hr`
                          }
                          <br></br>
                          {moment.utc(race.time).local().format("H:mm")}
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
  );
};

export default DashboardView;
