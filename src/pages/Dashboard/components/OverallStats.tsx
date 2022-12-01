import { ethers } from "ethers";
import Card from "../../../components/Card";
import { useProtocolStatistics } from "../../../hooks/stats";
import {
  formatNumberWithCommas,
  formatToTwoDecimals
} from "../../../utils/formatting";

const OverallStats = () => {
  const stats = useProtocolStatistics();
  const formattedTvl = stats?.tvl
    ? `$${formatNumberWithCommas(ethers.utils.formatEther(stats.tvl))}`
    : undefined;

  const formattedInplay = stats?.inPlay
    ? `$${formatNumberWithCommas(ethers.utils.formatEther(stats.inPlay))}`
    : undefined;

  const formattedPerformace = stats?.performance
    ? `${formatToTwoDecimals(stats.performance.toString())}%`
    : undefined;

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <Card title="Total Liquidity" data={formattedTvl} />
      <Card title="In Play" data={formattedInplay} />
      <Card title="Performance" data={formattedPerformace} />
    </dl>
  );
};

export default OverallStats;
