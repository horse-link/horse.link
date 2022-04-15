import { PageLayout } from "../../components";

type Props = {};

const pools = [
  {
    id: "1",
    underlying: {
        image: "/images/usdc.png",
        name: "USD Coin",
        symbol: "USDC",
    },
    supplied: 25000000,
    inPlay: 2000000,
    ownerAddress: "0x18a5ff44dcc65e8bFD01F48496f8f4Be6980CaA9",
  },
  {
    id: "2",
    underlying: {
        image: "/images/tether.png",
        name: "Tether",
        symbol: "USDT",
    },
    supplied: 37000000,
    inPlay: 2690000,
    ownerAddress: "0x14a09AFAaD55649571B59006060B7D1A6a9c2bA5",
  },
  {
    id: "2",
    underlying: {
        image: "/images/tether.png",
        name: "Tether",
        symbol: "USDT",
    },
    supplied: 37000000,
    inPlay: 2690000,
    ownerAddress: "0x14a09AFAaD55649571B59006060B7D1A6a9c2bA5",
  }
  // {
  //   id: "3",
  //   pair: [
  //     {
  //       image: "/images/trueusd.png",
  //       name: "True USD",
  //       symbol: "TUSD",
  //     },
  //     {
  //       image: "/images/ether.png",
  //       name: "Ether",
  //       symbol: "ETH",
  //     },
  //   ],
  //   supplied: 7000000,
  //   inPlay: 90000,
  //   ownerAddress: "0x18a5ff44dcc65e8bFD01F48496f8f4Be6980CaA9",
  // },
];

const PoolsView: React.FC<Props> = () => {
  // TODO: Do we want to make this table responsive?
  return (
    <PageLayout requiresAuth={false}>
      <div className="flex flex-col">
      <h3 className="text-lg mb-3 font-medium text-gray-900">Liquidity Pools</h3>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                  <th
                      scope="col"
                      className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Token
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Supplied
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      In Play
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Owner Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pools.map(pool => (
                    <tr key={pool.id}>
                      <td className="px-2 py-4 whitespace-nowrap"> {pool.id} </td>
                      <td className="flex px-2 py-4 items-center">
                        <img src={pool.underlying.image} alt={pool.underlying.name} className="h-4" />
                        <span> {pool.underlying.symbol} </span>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">{pool.supplied}</td>
                      <td className="px-2 py-4 whitespace-nowrap">{pool.inPlay}</td>
                      <td className="px-2 py-4 whitespace-nowrap">{pool.ownerAddress}</td>
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

export default PoolsView;
