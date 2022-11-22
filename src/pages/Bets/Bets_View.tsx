import { Button, PageLayout } from "../../components";
import { BetHistory } from "../../types";
import BetModal from "./components/BetModal";
import BetTable from "./components/BetTable";
import Select from "react-select";
import { paginationOptions } from "./Bets_Logic";
import Toggle from "../../components/Toggle";
import BetRows from "./components/BetRows";

type Props = {
  myBetsEnabled: boolean;
  onMyBetToggle: () => void;
  onClickBet: (bet?: BetHistory) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  selectedBet?: BetHistory;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  setPagination: (pagination: number) => void;
  page: number;
  setPage: (page: number) => void;
  totalBetHistory: BetHistory[] | undefined;
  userBetHistory: BetHistory[] | undefined;
  userMaxPages: number;
  totalMaxPages: number;
};

const BetsView = ({
  onClickBet,
  isModalOpen,
  onCloseModal,
  myBetsEnabled,
  onMyBetToggle,
  selectedBet,
  selectedFilter,
  setSelectedFilter,
  setPagination,
  page,
  setPage,
  totalBetHistory,
  userBetHistory,
  userMaxPages,
  totalMaxPages
}: Props) => {
  const filters = [
    { value: "ALL_BETS", name: "All Bets" },
    { value: "RESULTED", name: "Resulted" },
    { value: "PENDING", name: "Pending" },
    { value: "SETTLED", name: "Settled" }
  ];

  return (
    <PageLayout requiresAuth={false}>
      <BetModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        betData={selectedBet}
      />

      <div className="w-full flex justify-between col-span-2 p-5">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          Bets History
        </h3>
        <div className="flex flex-row space-x-3">
          <label className="flex flex-row text-lg font-medium text-gray-900 items-center">
            Filter
          </label>
          <div className="flex flex-row space-x-3">
            <Button
              className="cursor-pointer  hover:bg-gray-200 hover:text-white sm:w-auto sm:mb-0"
              onClick={() => setSelectedFilter("ALL_BETS")}
            >
              All Bets
            </Button>
            <Button
              className="cursor-pointer hover:bg-gray-200 hover:text-white sm:w-auto sm:mb-0"
              onClick={() => setSelectedFilter("RESULTED")}
            >
              Resulted
            </Button>
            <Button
              className="cursor-pointer hover:bg-gray-200 hover:text-white sm:w-auto sm:mb-0"
              onClick={() => setSelectedFilter("PENDING")}
            >
              Pending
            </Button>
            <Button
              className="cursor-pointer hover:bg-gray-200 hover:text-white sm:w-auto sm:mb-0"
              onClick={() => setSelectedFilter("SETTLED")}
            >
              Settled
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          <Select
            onChange={selection => selection && setPagination(selection.value)}
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
          <div className="flex gap-3 self-end justify-self-end items-center pb-2">
            <Toggle enabled={myBetsEnabled} onChange={onMyBetToggle} />
            <div className="font-semibold">My Bets</div>
          </div>
        </div>
      </div>
      <BetTable
        myBetsEnabled={myBetsEnabled}
        onClickBet={onClickBet}
        page={page}
        setPage={setPage}
        totalBetHistory={totalBetHistory}
        userBetHistory={userBetHistory}
        userMaxPages={userMaxPages}
        totalMaxPages={totalMaxPages}
        selectedFilter={selectedFilter}
      />
    </PageLayout>
  );
};

export default BetsView;
