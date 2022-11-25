import React from "react";
import { useConfig } from "../../providers/Config";
import { useAccount } from "wagmi";
import { BetHistory } from "../../types";
import { BetRow } from ".";

type Props = {
  myBetsSelected: boolean;
  bets?: BetHistory[];
  onClickBet: (bet?: BetHistory) => void;
};

export const BetRows: React.FC<Props> = ({
  myBetsSelected,
  bets,
  onClickBet
}) => {
  const { isConnected } = useAccount();
  const config = useConfig();

  return (
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
};
