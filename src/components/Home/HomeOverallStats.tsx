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
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <Card title="Total Liquidity" data={formattedTvl} />
      <Card title="In Play" data={formattedInplay} />
      <Card title="Performance" data={formattedPerformace} />
    </dl>
  );
};
