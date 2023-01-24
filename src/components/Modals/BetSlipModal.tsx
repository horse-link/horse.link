import React, { useMemo } from "react";
import { BaseModal } from "./BaseModal";
import { useBetSlipContext } from "../../context/BetSlipContext";
import utils from "../../utils";
import { useConfig } from "../../providers/Config";
import { BigNumber, ethers } from "ethers";
import { Loader } from "../Loader";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const BetSlipModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const config = useConfig();
  const { bets } = useBetSlipContext();

  const betsPerMarket = useMemo(() => {
    if (!bets || !bets.length || !config) return;

    return bets.reduce((prevObject, bet) => {
      const vault = utils.config.getVaultFromMarket(bet.market, config);
      if (!vault)
        throw new Error(
          `No vault could be found for associated market, ${bet.market.address}`
        );

      const wagerBn = ethers.utils.parseUnits(bet.wager, vault.asset.decimals);

      return {
        [vault.name]: prevObject[vault.name]
          ? prevObject[vault.name].add(wagerBn)
          : wagerBn
      };
    }, {} as Record<string, BigNumber>);
  }, [bets, config]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {!config ? <Loader /> : <div>aaaa</div>}
    </BaseModal>
  );
};
