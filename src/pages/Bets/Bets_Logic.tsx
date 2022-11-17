import { useState } from "react";
import { BetHistory } from "../../types";
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

  const [betTablePagination, setBetTablePagination] = useState(5);
  const [betTablePage, setBetTablePage] = useState(1);

  const onClickBet = (betData?: BetHistory) => {
    if (!betData) return;
    setSelectedBet(betData);
    setIsModalOpen(true);
  };

  const onMyBetToggle = () => setMyBetsEnabled(!myBetsEnabled);

  return (
    <BetsView
      myBetsEnabled={myBetsEnabled}
      onMyBetToggle={onMyBetToggle}
      onClickBet={onClickBet}
      isModalOpen={isModalOpen}
      onCloseModal={() => setIsModalOpen(false)}
      selectedBet={selectedBet}
      pagination={betTablePagination}
      setPagination={setBetTablePagination}
      page={betTablePage}
      setPage={setBetTablePage}
    />
  );
};

export default BetsLogics;
