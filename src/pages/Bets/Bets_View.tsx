import { PageLayout } from "../../components";
import Modal from "../../components/Modal";
import { BetHistory } from "../../types";

type Props = {
  betsData: BetHistory[];
  onClickBet: (bet: BetHistory) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
};
const BetsView = ({
  betsData,
  onClickBet,
  isModalOpen,
  onCloseModal
}: Props) => {
  return (
    <PageLayout requiresAuth={false}>
      <BetModal isOpen={isModalOpen} onClose={onCloseModal} />
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
                    propositionId
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
                    market_id
                  </th>
                  <th
                    scope="col"
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
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
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    tx
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {betsData.map(v => (
                  <Row
                    betData={v}
                    key={v.proposition_id}
                    onClick={() => onClickBet(v)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BetsView;

type BetModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const BetModal = ({ isOpen, onClose }: BetModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-152 flex flex-col">Bet Settle Modal</div>
    </Modal>
  );
};

type RowProps = {
  betData: BetHistory;
  onClick?: () => void;
};
const Row = ({ betData, onClick }: RowProps) => {
  return (
    <tr
      key={betData.proposition_id}
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="pl-5 pr-2 py-4 whitespace-nowrap">
        {betData.proposition_id}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.amount}</td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.market_id}</td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.odds}</td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.punter}</td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.result}</td>
      <td className="px-2 py-4 whitespace-nowrap">{betData.tx}</td>
    </tr>
  );
};
