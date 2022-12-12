import React from "react";
import { BetRow } from ".";
import { useWalletModal } from "../../providers/WalletModal";
import { BetHistory } from "../../types/bets";
import { Config } from "../../types/config";

type Props = {
  myBetsSelected: boolean;
  bets?: BetHistory[];
  isConnected: boolean;
  config?: Config;
  setSelectedBet: (bet?: BetHistory) => void;
  setIsModalOpen: (open: boolean) => void;
};

export const BetRows: React.FC<Props> = ({
  myBetsSelected,
  bets,
  isConnected,
  config,
  setSelectedBet,
  setIsModalOpen
}) => {
  const { openWalletModal } = useWalletModal();

  const onClickBet = (bet: BetHistory) => {
    if (!isConnected) return openWalletModal();
    setSelectedBet(bet);
    setIsModalOpen(true);
  };

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
