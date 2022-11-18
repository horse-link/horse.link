import React from "react";
import { useAccount } from "wagmi";
import { BetHistory } from "../../../types";
import { Row } from "./BetTable";

type Props = {
  myBetsSelected: boolean;
  bets?: BetHistory[];
  onClickBet: (bet?: BetHistory) => void;
};

const BetRows: React.FC<Props> = ({ myBetsSelected, bets, onClickBet }) => {
  const { isConnected } = useAccount();
  if (!isConnected && myBetsSelected)
    return <td className="p-2 select-none">Please connect your wallet</td>;
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
