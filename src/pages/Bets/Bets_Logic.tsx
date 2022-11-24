import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import useBets from "../../hooks/bet/useBets";
import { BetHistory } from "../../types";
import { calculateMaxPages } from "../../utils/bets";
import BetsView from "./Bets_View";
import { FilterOptions } from "./components/BetRows";

export type PaginationValues = 25 | 50 | 100;
export const paginationOptions = [
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 }
];

const BetsLogics = () => {
  const [myBetsEnabled, setMyBetsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [selectedFilter, setSelectedFilter] = useState<FilterOptions>(
    FilterOptions.ALL_BETS
  );
  const [betTablePagination, setBetTablePagination] = useState<PaginationValues>(25);
  const [betTablePage, setBetTablePage] = useState(1);

  const { isConnected } = useAccount();

  const { totalBetHistory, userBetHistory, totalBets } = useBets(
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
    setSelectedBet(betData);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setMyBetsEnabled(isConnected);
  }, [isConnected]);

  const onMyBetToggle = () => setMyBetsEnabled(prev => !prev);

  return (
    <BetsView
      myBetsEnabled={myBetsEnabled}
      onMyBetToggle={onMyBetToggle}
      onClickBet={onClickBet}
      isModalOpen={isModalOpen}
      onCloseModal={() => setIsModalOpen(false)}
      selectedBet={selectedBet}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      setPagination={setBetTablePagination}
      page={betTablePage}
      setPage={setBetTablePage}
      totalBetHistory={totalBetHistory}
      userBetHistory={userBetHistory}
      userMaxPages={userMaxPages}
      totalMaxPages={totalMaxPages}
    />
  );
};

export default BetsLogics;
