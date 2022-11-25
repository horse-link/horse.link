import React, { useMemo } from "react";
import { useConfig } from "../../../providers/Config";
import { useAccount } from "wagmi";
import { BetHistory } from "../../../types";
import { Row } from "./BetTable";

export enum FilterOptions {
  ALL_BETS = "ALL_BETS",
  RESULTED = "RESULTED",
  PENDING = "PENDING",
  SETTLED = "SETTLED"
}

type Props = {
  myBetsSelected: boolean;
  bets?: BetHistory[];
  onClickBet: (bet?: BetHistory) => void;
  selectedFilter: FilterOptions;
};

const BetRows: React.FC<Props> = ({
  myBetsSelected,
  bets,
  onClickBet,
  selectedFilter
}) => {
  const { isConnected } = useAccount();
  const config = useConfig();

  const filteredBets = useMemo(() => {
    if (!bets) return;

    switch (selectedFilter) {
      case FilterOptions.ALL_BETS:
        return bets;
      case FilterOptions.PENDING:
        return bets.filter(bet => !bet.settled);
      case FilterOptions.RESULTED:
        return bets.filter(bet => bet.settled && bet.marketResultAdded);
      case FilterOptions.SETTLED:
        return bets.filter(bet => bet.settled);
    }
  }, [selectedFilter, bets]);

  return (
    <React.Fragment>
      {!isConnected && myBetsSelected ? (
        <td className="p-2 select-none">Please connect your wallet</td>
      ) : !filteredBets ? (
        <td className="p-2 select-none">Loading...</td>
      ) : !filteredBets.length ? (
        <td className="p-2 select-none">No bets</td>
      ) : (
        filteredBets.map(bet => (
          <Row
            config={config}
            betData={bet}
            key={bet.tx}
            onClick={() => onClickBet(bet)}
          />
        ))
      )}
    </React.Fragment>
  );
};

export default BetRows;
