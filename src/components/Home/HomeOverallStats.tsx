import { Card } from "..";
import { useProtocolStatistics } from "../../hooks/stats";
import utils from "../../utils";

export const HomeOverallStats: React.FC = () => {
  const stats = useProtocolStatistics();

  const formattedTvl =
    stats?.tvl !== undefined
      ? `$${utils.formatting.formatNumberWithCommas(stats.tvl.toString())}`
      : undefined;

  const formattedInplay =
    stats?.inPlay !== undefined
      ? `$${utils.formatting.formatNumberWithCommas(stats.inPlay.toString())}`
      : undefined;

  const formattedPerformace =
    stats?.performance !== undefined
      ? `${utils.formatting.formatToTwoDecimals(stats.performance.toString())}%`
      : undefined;

  return (
    <dl className="flex w-full justify-between gap-x-6">
      <Card title="Total Liquidity" data={formattedTvl} />
      <Card title="In Play" data={formattedInplay} />
      <Card title="Performance" data={formattedPerformace} />
    </dl>
  );
};
