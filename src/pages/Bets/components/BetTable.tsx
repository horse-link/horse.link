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
        <table className="border-collapse table-auto w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-center">
              <th
                scope="col"
                className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                propositionId
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                amount
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                market_id
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                odds
              </th>

              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                punter
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                result
              </th>
              <th
                scope="col"
                className="pl-2 pr-5 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                tx
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
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="pl-5 pr-2 py-4 max-w-xs truncate">
        {betData?.proposition_id ?? <Skeleton />}
      </td>
      <td className="px-2 py-4">{betData?.amount ?? <Skeleton />}</td>
      <td className="px-2 py-4">{betData?.market_id ?? <Skeleton />}</td>
      <td className="px-2 py-4">{betData?.odds ?? <Skeleton />}</td>
      <td className="px-2 py-4 max-w-xs truncate">
        {betData?.punter ?? <Skeleton />}
      </td>
      <td className="px-2 py-4">{betData?.result ?? <Skeleton />}</td>
      <td className="pl-2 pr-5 py-4 max-w-xs truncate">
        {betData?.tx ?? <Skeleton />}
      </td>
    </tr>
  );
};
