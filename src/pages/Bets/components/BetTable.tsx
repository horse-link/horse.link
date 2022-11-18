import Skeleton from "react-loading-skeleton";
import classnames from "classnames";
import { BetHistory } from "../../../types";
import useBetHistory from "../../../hooks/bet/useBetHistory";
import { formatToFourDecimals } from "../../../utils/formatting";
import BetRows from "./BetRows";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import moment from "moment";

type Props = {
  myBetsEnabled: boolean;
  onClickBet: (bet?: BetHistory) => void;
};
const BetTable = ({ myBetsEnabled, onClickBet }: Props) => {
  const { address } = useAccount();
  const bets = useBetHistory();
  const myBets = useBetHistory(address);
  return (
    <div className="col-span-2 bg-gray-50 rounded-xl overflow-auto">
      <div className="shadow-sm overflow-hidden mt-2 mb-5">
        <table className="border-collapse table-fixed w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-center">
              <th
                scope="col"
                className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Punter
              </th>
              <th
                scope="col"
                className="px-2 py-3 w-20 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-2 py-3 w-32 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-2 py-3  text-left text-xs font-medium text-gray-500 uppercase"
              >
                Market ID
              </th>
              <th
                scope="col"
                className="pl-2 pr-5 py-3  text-left text-xs font-medium text-gray-500 uppercase"
              >
                Proposition ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {myBetsEnabled ? (
              <BetRows bets={myBets} onClickBet={onClickBet} />
            ) : (
              <BetRows bets={bets} onClickBet={onClickBet} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetTable;

type RowProps = {
  betData: BetHistory;
  onClick?: () => void;
};
export const Row = ({ betData, onClick }: RowProps) => {
  return (
    <tr
      key={betData.propositionId}
      onClick={onClick}
      className={classnames(
        "cursor-pointer hover:bg-gray-100",
        {
          "bg-green-300":
            (betData.winningPropositionId || betData.marketResultAdded) &&
            !betData.settled
        },
        {
          "bg-gray-300": betData.settled
        }
      )}
    >
      <td className="pl-5 pr-2 py-4 truncate">
        {betData.punter ?? <Skeleton />}
      </td>
      <td className="px-2 py-4">
        {formatToFourDecimals(ethers.utils.formatEther(betData.amount)) ?? (
          <Skeleton />
        )}
      </td>
      <td className="px-2 py-4">
        {moment.unix(betData.blockNumber).fromNow() ?? <Skeleton />}
      </td>
      <td className="px-2 py-4 truncate">
        {ethers.utils.parseBytes32String(betData.marketId) ?? <Skeleton />}
      </td>
      <td className="px-2 py-4 truncate">
        {ethers.utils.parseBytes32String(betData.propositionId) ?? <Skeleton />}
      </td>
    </tr>
  );
};
