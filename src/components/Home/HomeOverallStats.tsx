import { formatNumberWithCommas, formatToTwoDecimals } from "horselink-sdk";
import { Card } from "..";
import { useProtocolStatistics } from "../../hooks/stats";

export const HomeOverallStats: React.FC = () => {
  const stats = useProtocolStatistics();

  const formattedTvl =
    stats?.tvl !== undefined
      ? `$${formatNumberWithCommas(stats.tvl.toString())}`
      : undefined;

  const formattedInplay =
    stats?.inPlay !== undefined
      ? `$${formatNumberWithCommas(stats.inPlay.toString())}`
      : undefined;

  const formattedPerformace =
    stats?.performance !== undefined
      ? `${formatToTwoDecimals(stats.performance.toString())}%`
      : undefined;

  return (
    <dl className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
      <Card title="Total Liquidity" data={formattedTvl} />
      <Card title="In Play" data={formattedInplay} />
      <Card title="APY Last 30 Days" data={formattedPerformace} />
    </dl>
  );
};
