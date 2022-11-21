import { gql, useQuery } from "@apollo/client";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import Card from "../../../components/Card";
import { formatNumberWithCommas } from "../../../utils/formatting";

const GET_USER_STATS = gql`
  query UserStats($address: String!) {
    userStats(where: { address: $address }) {
      totalDeposits
      inPlay
      profits
    }
  }
`;
const MyStats = () => {
  const { address: userWalletAddress } = useAccount();
  const { data, loading } = useQuery(GET_USER_STATS, {
    variables: {
      address: userWalletAddress
    }
  });
  const { totalDeposits, inPlay, profits } = data?.userStats ?? {};
  const formattedDeposits = totalDeposits
    ? `$${formatNumberWithCommas(ethers.utils.formatEther(totalDeposits))}`
    : undefined;
  const formattedInplay = inPlay
    ? `$${formatNumberWithCommas(ethers.utils.formatEther(inPlay))}`
    : undefined;
  const formattedProfits = profits
    ? `$${formatNumberWithCommas(ethers.utils.formatEther(profits))}`
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
