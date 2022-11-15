import React from "react";
import { BetHistory } from "../../../types";
import { Row } from "./BetTable";

type Props = {
  bets?: BetHistory[];
  onClickBet: (bet?: BetHistory) => void;
};

const BetRows: React.FC<Props> = ({ bets, onClickBet }) => {
  if (!bets) return <td className="p-2 select-none">loading...</td>;

  return (
    <React.Fragment>
      {bets.length === 0 ? (
        <td className="p-2 select-none">no bets</td>
      ) : (
        bets.map(bet => (
          <Row betData={bet} key={bet.tx} onClick={() => onClickBet(bet)} />
        ))
      )}
    </React.Fragment>
  );
};

export default BetRows;
