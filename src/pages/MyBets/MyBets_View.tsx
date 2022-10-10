import { PageLayout } from "../../components";

type BetData = {
  id: string;
  amount: number;
  owner: string;
  payout: number;
  propositionId: string;
};

type Props = {
  myBetsData: BetData[];
  onClickBet: (bet: BetData) => void;
};
const MyBetsView = ({ myBetsData, onClickBet }: Props) => {
  return (
    <PageLayout requiresAuth={false}>
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
                    transactionId amount
                  </th>
                  <th
                    scope="col"
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    amount
                  </th>
                  <th
                    scope="col"
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    owner
                  </th>
                  <th
                    scope="col"
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    payout
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    propositionId
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myBetsData.map(v => (
                  <Row betData={v} key={v.id} onClick={() => onClickBet(v)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MyBetsView;

type RowProps = {
  betData: BetData;
  onClick?: () => void;
};
const Row = ({ betData, onClick }: RowProps) => {
  return (
    <tr
      key={betData.id}
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="pl-5 pr-2 py-4 whitespace-nowrap"> {betData.id} </td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.amount}</td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.owner}</td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.payout}</td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.propositionId}</td>
    </tr>
  );
};
