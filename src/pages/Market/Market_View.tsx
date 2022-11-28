import { BigNumber, ethers } from "ethers";
import Skeleton from "react-loading-skeleton";
import { PageLayout } from "../../components";
import Card from "../../components/Card";
import useMarketDetail from "../../hooks/market/useMarketDetail";
import { Bet } from "../../types/entities";
import { formatToFourDecimals } from "../../utils/formatting";

type Props = {
  marketAddressList: string[];
  onClickMarket: (marketAddress: string) => void;
  stats: {
    totalBets?: number;
    totalVolume?: BigNumber;
    largestBet?: Bet;
  };
};

const MarketView = ({ marketAddressList, onClickMarket, stats }: Props) => {
  const { totalBets, totalVolume, largestBet } = stats;

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
                    Target
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
                {marketAddressList.map((v, i) => (
                  <Row
                    marketAddress={v}
                    key={i}
                    onClick={() => onClickMarket(v)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
export default MarketView;

type RowProps = {
  marketAddress?: string;
  onClick?: () => void;
};

const Row = ({ marketAddress, onClick }: RowProps) => {
  const marketDetail = useMarketDetail(marketAddress);
  const { name, target, totalInPlay, vaultAddress } = marketDetail || {};
  return (
    <tr
      key={marketAddress}
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="pl-5 pr-2 py-4 whitespace-nowrap">
        {name || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">{target || <Skeleton />}</td>
      <td className="px-2 py-4 whitespace-nowrap">
        {totalInPlay || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {marketAddress || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {vaultAddress || <Skeleton />}
      </td>
    </tr>
  );
};
