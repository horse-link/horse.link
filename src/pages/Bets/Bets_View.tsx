import { PageLayout } from "../../components";
import { BetHistory } from "../../types";
import BetModal from "./components/BetModal";
import BetTable from "./components/BetTable";
import MyBetsToggle from "./components/MyBetsToggle";

type Props = {
  myBetsEnabled: boolean;
  onMyBetToggle: () => void;
  onClickBet: (bet?: BetHistory) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  selectedBet?: BetHistory;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
};
const BetsView = ({
  onClickBet,
  isModalOpen,
  onCloseModal,
  myBetsEnabled,
  onMyBetToggle,
  selectedBet,
  selectedFilter,
  setSelectedFilter
}: Props) => {
  const filters = [
    { value: "ALL_BETS", name: "All Bets" },
    { value: "RESULTED", name: "Resulted" },
    { value: "PENDING", name: "Pending" },
    { value: "SETTLED", name: "Settled" },
    { value: "UNSETTLED", name: "Unsettled" }
  ];

  return (
    <PageLayout requiresAuth={false}>
      <BetModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        betData={selectedBet}
      />
      <div className="grid grid-cols-2 gap-2">
        <h3 className="text-lg font-medium text-gray-900">Bets History</h3>
        <div className="flex flex-col">
          <label>Filter</label>
          <select
            value={selectedFilter}
            onChange={e => setSelectedFilter(e.target.value)}
            name="filters"
            id="filters"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-2"
          >
            {filters.map(filter => (
              <option value={filter.value}>{filter.name}</option>
            ))}
          </select>
        </div>
        <MyBetsToggle enabled={myBetsEnabled} onChange={onMyBetToggle} />
        <BetTable
          myBetsEnabled={myBetsEnabled}
          onClickBet={onClickBet}
          selectedFilter={selectedFilter}
        />
      </div>
    </PageLayout>
  );
};

export default BetsView;
