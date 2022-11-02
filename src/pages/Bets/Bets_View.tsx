import { PageLayout } from "../../components";
import { BetHistory } from "../../types";
import BetModal from "./components/BetModal";
import BetTable from "./components/BetTable";
import MyBetsToggle from "./components/MyBetsToggle";

type Props = {
  betsData: BetHistory[] | undefined[];
  myBetsEnabled: boolean;
  onMyBetToggle: (isEnable: boolean) => void;
  onClickBet: (bet?: BetHistory) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  selectedBet?: BetHistory;
};
const BetsView = ({
  betsData,
  onClickBet,
  isModalOpen,
  onCloseModal,
  myBetsEnabled,
  onMyBetToggle,
  selectedBet
}: Props) => {
  return (
    <PageLayout requiresAuth={false}>
      <BetModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        betData={selectedBet}
      />
      <div className="grid grid-cols-2 gap-2">
        <h3 className="text-lg font-medium text-gray-900">Bets History</h3>
        <MyBetsToggle enabled={myBetsEnabled} onChange={onMyBetToggle} />
        <BetTable betsData={betsData} onClickBet={onClickBet} />
      </div>
    </PageLayout>
  );
};

export default BetsView;
