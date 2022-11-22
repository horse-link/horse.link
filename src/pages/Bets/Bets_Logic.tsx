import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import useBets from "../../hooks/bet/useBets";
import { BetHistory } from "../../types";
import { calculateMaxPages } from "../../utils/bets";
import BetsView from "./Bets_View";

export const paginationOptions = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 }
];

const BetsLogics = () => {
  const [myBetsEnabled, setMyBetsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL_BETS");

  const [betTablePagination, setBetTablePagination] = useState(5);
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
