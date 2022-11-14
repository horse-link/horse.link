import { useState } from "react";
import { BetHistory } from "../../types";
import BetsView from "./Bets_View";

const BetsLogics = () => {
  const [myBetsEnabled, setMyBetsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();

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
    />
  );
};

export default BetsLogics;
