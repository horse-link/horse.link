import { ethers } from "ethers";
import Card from "../../../components/Card";
import useUserStatistics from "../../../hooks/data/useUserStatistics";
import { formatNumberWithCommas } from "../../../utils/formatting";

const MyStats = () => {
  const stats = useUserStatistics();

  const { totalDeposited, inPlay, pnl } = stats ?? {};
  const formattedDeposits = totalDeposited
    ? `$${formatNumberWithCommas(ethers.utils.formatEther(totalDeposited))}`
    : undefined;
  const formattedInplay = inPlay
    ? `$${formatNumberWithCommas(ethers.utils.formatEther(inPlay))}`
    : undefined;
  const formattedProfits = pnl
    ? `$${formatNumberWithCommas(ethers.utils.formatEther(pnl))}`
    : undefined;
  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <Card title="Deposits" data={formattedDeposits} />
      <Card title="In Play" data={formattedInplay} />
      <Card title="Profits" data={formattedProfits} />
    </dl>
  );
};

export default MyStats;
