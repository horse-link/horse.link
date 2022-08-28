import { PageLayout } from "../../components";

type Props = {};

const vaults = [
  {
    id: "USDC",
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
    id: "USDT",
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
    id: "DAI",
    underlying: {
        image: "/images/dai.png",
        name: "Dai",
        symbol: "DAI",
    },
    supplied: 1000000,
    inPlay: 10000,
    ownerAddress: "0x14a09AFAaD55649571B59006060B7D1A6a9c2bA5",
  }
];

const VaultsView: React.FC<Props> = () => {
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
                  {vaults.map(vault => (
                    <tr key={vault.id}>
                      <td className="px-2 py-4 whitespace-nowrap"> {vault.id} </td>
                      <td className="flex px-2 py-4 items-center">
                        <img src={vault.underlying.image} alt={vault.underlying.name} className="h-4" />
                        <span> {vault.underlying.symbol} </span>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">{vault.supplied}</td>
                      <td className="px-2 py-4 whitespace-nowrap">{vault.inPlay}</td>
                      <td className="px-2 py-4 whitespace-nowrap">{vault.ownerAddress}</td>
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

export default VaultsView;
