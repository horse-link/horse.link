import { useMarketStatistics } from "../hooks/stats";
import { PageLayout } from "../components";
import Card from "../components/Card";
import { formatToFourDecimals } from "../utils/formatting";
import { ethers } from "ethers";
import { useConfig } from "src/providers/Config";
import { MarketRow } from "src/components/Markets";

const Markets: React.FC = () => {
  const config = useConfig();
  const { totalBets, totalVolume, largestBet } = useMarketStatistics();

  return (
    <PageLayout>
      <div className="flex w-full justify-between gap-x-4 mb-4">
        <Card
          title="24H Volume"
          data={
            totalVolume &&
            `$${formatToFourDecimals(ethers.utils.formatEther(totalVolume))}`
          }
        />
        <Card title="24H Bets" data={totalBets?.toString()} />
        <Card
          title="24H Largest Bet"
          data={
            largestBet &&
            `$${formatToFourDecimals(
              ethers.utils.formatEther(largestBet.amount)
            )}`
          }
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg mb-3 font-medium text-gray-900">Markets </h3>
        <div className="bg-gray-50 rounded-xl overflow-auto">
          <div className="shadow-sm overflow-hidden mt-2 mb-5">
            <table className="border-collapse table-auto w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Total In Play
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Market Address
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Vault Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {config ? (
                  config.markets.map(market => (
                    <MarketRow
                      key={market.address}
                      config={config}
                      market={market}
                      onClick={() => {}}
                    />
                  ))
                ) : (
                  <td className="p-2 select-none">Loading...</td>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Markets;
