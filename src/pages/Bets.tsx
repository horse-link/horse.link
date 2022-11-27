import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import useBets from "../hooks/bet/useBets";
import { BetHistory, PaginationValues } from "../types";
import { calculateMaxPages } from "../utils/bets";
import { PageLayout } from "../components";
import Select from "react-select";
import Toggle from "../components/Toggle";
import { BetTable } from "../components/Bets";
import { SettleBetModal } from "../components/Modals";
import { useWalletModal } from "src/providers/WalletModal";

const paginationOptions = [
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 }
];

const Bets: React.FC = () => {
  const [myBetsEnabled, setMyBetsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [betTablePagination, setBetTablePagination] =
    useState<PaginationValues>(25);
  const [betTablePage, setBetTablePage] = useState(1);

  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const { totalBetHistory, userBetHistory, totalBets, refetch } = useBets(
    // limit for bets returned will be current pagination
    betTablePagination,
    // skip calculation
    (betTablePage - 1) * betTablePagination
  );

  // max pages for "my bets" table
  const userMaxPages = useMemo(() => {
    if (!userBetHistory || userBetHistory.length === 0) return 1;

    return calculateMaxPages(betTablePagination, userBetHistory.length);
  }, [userBetHistory, betTablePagination]);

  // max pages for total bet history
  const totalMaxPages = useMemo(() => {
    if (!totalBets || totalBets === 0) return 1;

    return calculateMaxPages(betTablePagination, totalBets);
  }, [totalBets, betTablePagination]);

  // this prevents switching to an invalid page
  useEffect(() => {
    if (myBetsEnabled) {
      setBetTablePage(betTablePage > userMaxPages ? 1 : betTablePage);
    } else {
      setBetTablePage(betTablePage > totalMaxPages ? 1 : betTablePage);
    }
  }, [userMaxPages, totalMaxPages, betTablePage, myBetsEnabled]);

  const onClickBet = (betData?: BetHistory) => {
    if (!betData) return;
    if (!isConnected) return openWalletModal();
    setSelectedBet(betData);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setMyBetsEnabled(isConnected);
  }, [isConnected]);

  const onMyBetToggle = () => setMyBetsEnabled(prev => !prev);

  return (
    <PageLayout requiresAuth={false}>
      <div className="w-full flex justify-between col-span-2 p-5">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          Bets History
        </h3>
        <div className="flex items-center">
          <Select
            onChange={selection =>
              selection &&
              setBetTablePagination(selection.value as PaginationValues)
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
          <div className="flex gap-3 self-end justify-self-end items-center pb-2">
            <Toggle enabled={myBetsEnabled} onChange={onMyBetToggle} />
            <div className="font-semibold">My Bets</div>
          </div>
        </div>
      </div>
      <BetTable
        myBetsEnabled={myBetsEnabled}
        onClickBet={onClickBet}
        page={betTablePage}
        setPage={setBetTablePage}
        totalBetHistory={totalBetHistory}
        userBetHistory={userBetHistory}
        userMaxPages={userMaxPages}
        totalMaxPages={totalMaxPages}
      />
      <SettleBetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedBet={selectedBet}
        refetch={refetch}
      />
    </PageLayout>
  );
};

export default Bets;
