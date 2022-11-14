import React from "react";
import { BetHistory } from "../../../types";
import { Row } from "./BetTable";

type Props = {
  bets?: BetHistory[];
  onClickBet: (bet?: BetHistory) => void;
};

const BetRows: React.FC<Props> = ({ bets, onClickBet }) => (
  <React.Fragment>
    {!bets ? (
      <td className="p-2 select-none">loading...</td>
    ) : (
      bets.map(v => (
        <Row betData={v} key={v.tx} onClick={() => onClickBet(v)} />
      ))
    )}
  </React.Fragment>
);

export default BetRows;
