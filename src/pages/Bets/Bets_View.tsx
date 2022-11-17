import { PageLayout } from "../../components";
import { BetHistory } from "../../types";
import BetModal from "./components/BetModal";
import BetTable from "./components/BetTable";
import MyBetsToggle from "./components/MyBetsToggle";
import Select from "react-select";
import { paginationOptions } from "./Bets_Logic";

type Props = {
  myBetsEnabled: boolean;
  onMyBetToggle: () => void;
  onClickBet: (bet?: BetHistory) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  selectedBet?: BetHistory;
  pagination: number;
  setPagination: (pagination: number) => void;
  page: number;
  setPage: (page: number) => void;
};

const BetsView = ({
  onClickBet,
  isModalOpen,
  onCloseModal,
  myBetsEnabled,
  onMyBetToggle,
  selectedBet,
  pagination,
  setPagination,
  page,
  setPage
}: Props) => {
  return (
    <PageLayout requiresAuth={false}>
      <BetModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        betData={selectedBet}
      />
      <div className="grid grid-cols-2 gap-2">
        <div className="w-full flex justify-between col-span-2">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            Bets History
          </h3>
          <div className="flex items-center">
            <Select
              onChange={selection =>
                selection && setPagination(selection.value)
              }
              options={paginationOptions}
              defaultValue={paginationOptions[0]}
              isClearable={false}
              isSearchable={false}
              styles={{
                container: base => ({
                  ...base,
                  marginRight: "1rem"
                }),
                valueContainer: base => ({
                  ...base,
                  paddingLeft: "1rem",
                  paddingRight: "1rem"
                }),
                indicatorSeparator: base => ({
                  ...base,
                  display: "none"
                })
              }}
            />
            <MyBetsToggle enabled={myBetsEnabled} onChange={onMyBetToggle} />
          </div>
        </div>
        <BetTable
          myBetsEnabled={myBetsEnabled}
          onClickBet={onClickBet}
          pagination={pagination}
          page={page}
          setPage={setPage}
        />
      </div>
    </PageLayout>
  );
};

export default BetsView;
