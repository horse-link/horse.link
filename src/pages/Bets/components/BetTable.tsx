import Skeleton from "react-loading-skeleton";
import { BetHistory } from "../../../types";

type Props = {
  betsData: BetHistory[] | undefined[];
  onClickBet: (bet?: BetHistory) => void;
};
const BetTable = ({ betsData, onClickBet }: Props) => {
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
                className="px-2 py-3 w-20 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Block
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
            {betsData.map(v => (
              <Row
                betData={v}
                key={v?.proposition_id}
                onClick={() => onClickBet(v)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetTable;

type RowProps = {
  betData?: BetHistory;
  onClick?: () => void;
};
const Row = ({ betData, onClick }: RowProps) => {
  return (
    <tr
      key={betData?.proposition_id}
      onClick={onClick}
      className={
        betData?.settled
          ? "cursor-pointer bg-gray-300 hover:bg-gray-100"
          : "cursor-pointer hover:bg-gray-100"
      }
    >
      <td className="pl-5 pr-2 py-4 truncate">
        {betData?.punter ?? <Skeleton />}
      </td>
      <td className="px-2 py-4">{betData?.amount ?? <Skeleton />}</td>
      <td className="px-2 py-4">{betData?.blockNumber ?? <Skeleton />}</td>
      <td className="px-2 py-4 truncate">
        {betData?.market_id ?? <Skeleton />}
      </td>
      <td className="px-2 py-4 truncate">
        {betData?.proposition_id ?? <Skeleton />}
      </td>
    </tr>
  );
};
