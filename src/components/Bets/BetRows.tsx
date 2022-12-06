import React from "react";
import { BetRow } from ".";
import { BetHistory } from "../../types/bets";
import { Config } from "../../types/config";

type Props = {
  myBetsSelected: boolean;
  bets?: BetHistory[];
  onClickBet: (bet?: BetHistory) => void;
  isConnected: boolean;
  config?: Config;
};

export const BetRows: React.FC<Props> = ({
  myBetsSelected,
  bets,
  onClickBet,
  isConnected,
  config
}) => (
  <React.Fragment>
    {!isConnected && myBetsSelected ? (
      <td className="p-2 select-none">Please connect your wallet</td>
    ) : !bets ? (
      <td className="p-2 select-none">Loading...</td>
    ) : !bets.length ? (
      <td className="p-2 select-none">No bets</td>
    ) : (
      bets.map(bet => (
        <BetRow
          config={config}
          betData={bet}
          key={bet.tx}
          onClick={() => onClickBet(bet)}
        />
      ))
    )}
  </React.Fragment>
);
